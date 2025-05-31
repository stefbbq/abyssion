import { assertEquals } from '$std/assert/mod.ts'
import { createKeyboardControls } from '../createKeyboardControls.ts'
import type { KeyboardInputConfig } from '../../types.ts'

const mockEventListeners = new Map<string, Set<EventListenerOrEventListenerObject>>()
const originalAddEventListener = globalThis.addEventListener
const originalRemoveEventListener = globalThis.removeEventListener

// Setup mocks
function setupEventListenerMocks() {
  mockEventListeners.clear()

  globalThis.addEventListener = (type: string, listener: EventListenerOrEventListenerObject) => {
    if (!mockEventListeners.has(type)) {
      mockEventListeners.set(type, new Set())
    }
    mockEventListeners.get(type)!.add(listener)
  }

  globalThis.removeEventListener = (type: string, listener: EventListenerOrEventListenerObject) => {
    const listeners = mockEventListeners.get(type)
    if (listeners) {
      listeners.delete(listener)
    }
  }
}

// Trigger mock events
function triggerKeyboardEvent(key: string) {
  const listeners = mockEventListeners.get('keydown')
  if (listeners) {
    const event = { key } as KeyboardEvent
    listeners.forEach((listener) => {
      if (typeof listener === 'function') {
        listener(event)
      } else {
        listener.handleEvent(event)
      }
    })
  }
}

// Cleanup mocks
function cleanupEventListenerMocks() {
  globalThis.addEventListener = originalAddEventListener
  globalThis.removeEventListener = originalRemoveEventListener
  mockEventListeners.clear()
}

Deno.test('createKeyboardControls', async (test) => {
  const testConfig: KeyboardInputConfig = {
    toggleRotation: [' ', 'Space'],
    regenerateLayers: ['r', 'R'],
  }

  let toggleRotationCalled = 0
  let regenerateLayersCalled = 0

  const testActions = {
    onToggleRotation: () => {
      toggleRotationCalled++
    },
    onRegenerateLayers: () => {
      regenerateLayersCalled++
    },
  }

  await test.step('setup', () => {
    setupEventListenerMocks()
    toggleRotationCalled = 0
    regenerateLayersCalled = 0
  })

  await test.step('should create keyboard controls with correct initial state', () => {
    const controls = createKeyboardControls(testConfig, testActions)

    assertEquals(typeof controls.activate, 'function')
    assertEquals(typeof controls.deactivate, 'function')
    assertEquals(typeof controls.cleanup, 'function')
    assertEquals(typeof controls.getState, 'function')

    const state = controls.getState()
    assertEquals(state.isActive, false)
  })

  await test.step('should activate and deactivate correctly', () => {
    mockEventListeners.clear()
    const controls = createKeyboardControls(testConfig, testActions)

    // Initially inactive
    assertEquals(controls.getState().isActive, false)
    assertEquals(mockEventListeners.get('keydown')?.size || 0, 0)

    // Activate
    controls.activate()
    assertEquals(controls.getState().isActive, true)
    assertEquals(mockEventListeners.get('keydown')?.size || 0, 1)

    // Deactivate
    controls.deactivate()
    assertEquals(controls.getState().isActive, false)
    assertEquals(mockEventListeners.get('keydown')?.size || 0, 0)
  })

  await test.step('should handle multiple activations safely', () => {
    mockEventListeners.clear()
    const controls = createKeyboardControls(testConfig, testActions)

    controls.activate()
    const firstListenerCount = mockEventListeners.get('keydown')?.size || 0

    controls.activate() // Second activation should be ignored
    const secondListenerCount = mockEventListeners.get('keydown')?.size || 0

    assertEquals(firstListenerCount, secondListenerCount)
    assertEquals(controls.getState().isActive, true)
  })

  await test.step('should handle multiple deactivations safely', () => {
    mockEventListeners.clear()
    const controls = createKeyboardControls(testConfig, testActions)

    controls.activate()
    controls.deactivate()
    assertEquals(controls.getState().isActive, false)

    controls.deactivate() // Second deactivation should be safe
    assertEquals(controls.getState().isActive, false)
    assertEquals(mockEventListeners.get('keydown')?.size || 0, 0)
  })

  await test.step('should trigger toggle rotation for configured keys', () => {
    mockEventListeners.clear()
    toggleRotationCalled = 0
    const controls = createKeyboardControls(testConfig, testActions)
    controls.activate()

    const initialCount = toggleRotationCalled

    triggerKeyboardEvent(' ')
    assertEquals(toggleRotationCalled, initialCount + 1)

    triggerKeyboardEvent('Space')
    assertEquals(toggleRotationCalled, initialCount + 2)
  })

  await test.step('should trigger regenerate layers for configured keys', () => {
    mockEventListeners.clear()
    regenerateLayersCalled = 0
    const controls = createKeyboardControls(testConfig, testActions)
    controls.activate()

    const initialCount = regenerateLayersCalled

    triggerKeyboardEvent('r')
    assertEquals(regenerateLayersCalled, initialCount + 1)

    triggerKeyboardEvent('R')
    assertEquals(regenerateLayersCalled, initialCount + 2)
  })

  await test.step('should ignore non-configured keys', () => {
    mockEventListeners.clear()
    const initialToggleCount = toggleRotationCalled
    const initialRegenerateCount = regenerateLayersCalled
    const controls = createKeyboardControls(testConfig, testActions)
    controls.activate()

    triggerKeyboardEvent('a')
    triggerKeyboardEvent('Enter')
    triggerKeyboardEvent('Escape')

    assertEquals(toggleRotationCalled, initialToggleCount)
    assertEquals(regenerateLayersCalled, initialRegenerateCount)
  })

  await test.step('should not trigger events when inactive', () => {
    mockEventListeners.clear()
    const initialToggleCount = toggleRotationCalled
    const initialRegenerateCount = regenerateLayersCalled
    const controls = createKeyboardControls(testConfig, testActions)
    // Don't activate

    triggerKeyboardEvent(' ')
    triggerKeyboardEvent('r')

    assertEquals(toggleRotationCalled, initialToggleCount)
    assertEquals(regenerateLayersCalled, initialRegenerateCount)
  })

  await test.step('should cleanup properly', () => {
    mockEventListeners.clear()
    const controls = createKeyboardControls(testConfig, testActions)
    controls.activate()

    assertEquals(controls.getState().isActive, true)
    assertEquals((mockEventListeners.get('keydown')?.size || 0) > 0, true)

    controls.cleanup()

    assertEquals(controls.getState().isActive, false)
    assertEquals(mockEventListeners.get('keydown')?.size || 0, 0)
  })

  await test.step('should work with empty key arrays', () => {
    mockEventListeners.clear()
    const initialToggleCount = toggleRotationCalled
    const initialRegenerateCount = regenerateLayersCalled

    const emptyConfig: KeyboardInputConfig = {
      toggleRotation: [],
      regenerateLayers: [],
    }

    const controls = createKeyboardControls(emptyConfig, testActions)
    controls.activate()

    triggerKeyboardEvent(' ')
    triggerKeyboardEvent('r')

    assertEquals(toggleRotationCalled, initialToggleCount)
    assertEquals(regenerateLayersCalled, initialRegenerateCount)
  })

  await test.step('cleanup', () => {
    cleanupEventListenerMocks()
  })
})
