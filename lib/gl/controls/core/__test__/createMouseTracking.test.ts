import { assert, assertEquals } from '$std/assert/mod.ts'
import { createMouseTracking } from '../createMouseTracking.ts'

class MockMouseEvent {
  clientX: number
  clientY: number
  type: string

  constructor(type: string, options: { clientX: number; clientY: number }) {
    this.type = type
    this.clientX = options.clientX
    this.clientY = options.clientY
  }
}

const eventListeners = new Map<string, EventListenerOrEventListenerObject[]>()
const originalAddEventListener = globalThis.addEventListener
const originalRemoveEventListener = globalThis.removeEventListener

function setupEventListenerMocks() {
  eventListeners.clear()

  globalThis.addEventListener = (type: string, listener: EventListenerOrEventListenerObject) => {
    if (!eventListeners.has(type)) eventListeners.set(type, [])
    eventListeners.get(type)!.push(listener)
  }

  globalThis.removeEventListener = (type: string, listener: EventListenerOrEventListenerObject) => {
    const listeners = eventListeners.get(type)

    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }
}

function triggerMouseEvent(clientX: number, clientY: number) {
  const listeners = eventListeners.get('mousemove')
  if (listeners && listeners.length > 0) {
    const event = new MockMouseEvent('mousemove', { clientX, clientY })
    // Call the actual listener function registered by createMouseTracking
    listeners.forEach((listener) => typeof listener === 'function' && listener(event as unknown as Event))
  }
}

function restoreEventListeners() {
  globalThis.addEventListener = originalAddEventListener
  globalThis.removeEventListener = originalRemoveEventListener
  eventListeners.clear()
}

Deno.test('createMouseTracking', async (test: Deno.TestContext) => {
  await test.step('setup', () => {
    setupEventListenerMocks()

    // Mock screen dimensions
    Object.defineProperty(globalThis, 'innerWidth', {
      value: 1920,
      writable: true,
    })
    Object.defineProperty(globalThis, 'innerHeight', {
      value: 1080,
      writable: true,
    })
  })

  await test.step('should create mouse tracking with correct initial state', () => {
    eventListeners.clear() // Clear any previous listeners
    const mouseTracking = createMouseTracking(1.0)

    assertEquals(typeof mouseTracking.getCurrentTarget, 'function')
    assertEquals(typeof mouseTracking.getState, 'function')
    assertEquals(typeof mouseTracking.activate, 'function')
    assertEquals(typeof mouseTracking.deactivate, 'function')
    assertEquals(typeof mouseTracking.cleanup, 'function')

    const state = mouseTracking.getState()
    assertEquals(state.isActive, true) // Auto-activated
    assertEquals(state.currentTarget.targetRotationX, 0)
    assertEquals(state.currentTarget.targetRotationY, 0)
  })

  await test.step('should auto-activate on creation', () => {
    eventListeners.clear() // Clear first
    const mouseTracking = createMouseTracking(1.0)
    assertEquals(mouseTracking.getState().isActive, true)
    // Should have registered a listener
    assertEquals(eventListeners.get('mousemove')?.length || 0, 1)
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should update target on mouse move', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(2.0)

    // Trigger mouse move at center (960, 540) which should normalize to (0, 0)
    triggerMouseEvent(960, 540)

    const target = mouseTracking.getCurrentTarget()
    assertEquals(target.targetRotationX, 0) // 0 * 2.0
    assertEquals(target.targetRotationY, 0) // 0 * 2.0
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should calculate rotation targets correctly', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.5)

    // Mouse at top-left (0, 0) normalizes to (-1, -1)
    triggerMouseEvent(0, 0)

    const target = mouseTracking.getCurrentTarget()
    assertEquals(target.targetRotationX, -1.5) // -1 * 1.5 (y becomes X rotation)
    assertEquals(target.targetRotationY, -1.5) // -1 * 1.5 (x becomes Y rotation)
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should handle different mouse coefficients', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(0.5)

    // Mouse at bottom-right (1920, 1080) normalizes to (1, 1)
    triggerMouseEvent(1920, 1080)

    const target = mouseTracking.getCurrentTarget()
    assertEquals(target.targetRotationX, 0.5) // 1 * 0.5
    assertEquals(target.targetRotationY, 0.5) // 1 * 0.5
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should update state immutably', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.0)

    const initialState = mouseTracking.getState()

    // Quarter screen position
    triggerMouseEvent(480, 270)

    const newState = mouseTracking.getState()

    // States should be different objects
    assert(initialState !== newState)
    assertEquals(initialState.currentTarget.targetRotationX, 0)
    assertEquals(initialState.currentTarget.targetRotationY, 0)

    // New state should have updated values
    assert(newState.currentTarget.targetRotationX !== 0 || newState.currentTarget.targetRotationY !== 0)
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should deactivate and reactivate correctly', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.0)

    assertEquals(mouseTracking.getState().isActive, true)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 1)

    mouseTracking.deactivate()
    assertEquals(mouseTracking.getState().isActive, false)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 0)

    mouseTracking.activate()
    assertEquals(mouseTracking.getState().isActive, true)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 1)
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should handle multiple activations safely', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.0)

    assertEquals(mouseTracking.getState().isActive, true)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 1)

    mouseTracking.activate() // Second activation should be ignored
    assertEquals(mouseTracking.getState().isActive, true)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 1) // Still just one listener
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should handle multiple deactivations safely', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.0)

    mouseTracking.deactivate()
    assertEquals(mouseTracking.getState().isActive, false)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 0)

    mouseTracking.deactivate() // Second deactivation should be safe
    assertEquals(mouseTracking.getState().isActive, false)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 0)
    // Already deactivated, no extra cleanup needed
  })

  await test.step('should not update targets when inactive', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.0)

    mouseTracking.deactivate()

    const targetBeforeMove = mouseTracking.getCurrentTarget()

    // This event should not trigger any handlers since we're deactivated
    triggerMouseEvent(1000, 1000)

    const targetAfterMove = mouseTracking.getCurrentTarget()

    assertEquals(targetBeforeMove, targetAfterMove)
    // Already deactivated, no extra cleanup needed
  })

  await test.step('should cleanup properly', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(1.0)

    assertEquals(mouseTracking.getState().isActive, true)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 1)

    mouseTracking.cleanup()

    assertEquals(mouseTracking.getState().isActive, false)
    assertEquals(eventListeners.get('mousemove')?.length || 0, 0)
    // Already cleaned up
  })

  await test.step('should work with zero coefficient', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(0)

    triggerMouseEvent(1920, 1080)

    const target = mouseTracking.getCurrentTarget()
    assertEquals(target.targetRotationX, 0)
    assertEquals(target.targetRotationY, 0)
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('should work with negative coefficient', () => {
    eventListeners.clear() // Clear previous listeners
    const mouseTracking = createMouseTracking(-1.0)

    // Top-left, normalizes to (-1, -1)
    triggerMouseEvent(0, 0)

    const target = mouseTracking.getCurrentTarget()
    assertEquals(target.targetRotationX, 1.0) // -1 * -1.0
    assertEquals(target.targetRotationY, 1.0) // -1 * -1.0
    mouseTracking.cleanup() // Clean up for next test
  })

  await test.step('cleanup', () => {
    restoreEventListeners()
  })
})
