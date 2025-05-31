/// <reference lib="deno.ns" />
import { assertEquals } from '$std/assert/mod.ts'
import { updateAnimationEngine } from '../../core/updateAnimationEngine.ts'
import { createAnimationEngine } from '../../core/createAnimationEngine.ts'
import type { AnimationBehavior, AnimationFrame } from '../../types.ts'

// Mock state type for testing
type TestState = {
  value: number
  count: number
}

// Helper to create animation frame
const createFrame = (deltaTime: number, totalTime: number, frameCount: number): AnimationFrame => ({
  deltaTime,
  totalTime,
  frameCount,
})

Deno.test('updateAnimationEngine - behavior application', async (test) => {
  await test.step('should apply single behavior', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const engine = createAnimationEngine(initialState, [behavior])
    const frame = createFrame(16.67, 1000, 60)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(updatedEngine.currentState.value, 11)
    assertEquals(updatedEngine.currentState.count, 5)
    assertEquals(updatedEngine.frameCount, 60)
    assertEquals(updatedEngine.lastTime, 1000)
  })

  await test.step('should apply multiple behaviors in sequence', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 2 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count * 2 })
    const behavior3: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const engine = createAnimationEngine(initialState, [behavior1, behavior2, behavior3])
    const frame = createFrame(16.67, 2000, 120)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(updatedEngine.currentState.value, 13) // 10 + 2 + 1
    assertEquals(updatedEngine.currentState.count, 10) // 5 * 2
    assertEquals(updatedEngine.frameCount, 120)
    assertEquals(updatedEngine.lastTime, 2000)
  })

  await test.step('should handle no behaviors', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const engine = createAnimationEngine(initialState, [])
    const frame = createFrame(16.67, 500, 30)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(updatedEngine.currentState, initialState)
    assertEquals(updatedEngine.frameCount, 30)
    assertEquals(updatedEngine.lastTime, 500)
  })
})

Deno.test('updateAnimationEngine - frame data usage', async (test) => {
  await test.step('should pass frame data to behaviors', () => {
    let capturedFrame: AnimationFrame | null = null
    const initialState: TestState = { value: 0, count: 0 }
    const behavior: AnimationBehavior<TestState> = (state, frame) => {
      capturedFrame = frame
      return { ...state, value: frame.deltaTime, count: frame.frameCount }
    }
    const engine = createAnimationEngine(initialState, [behavior])
    const frame = createFrame(33.33, 1500, 45)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(capturedFrame, frame)
    assertEquals(updatedEngine.currentState.value, 33.33)
    assertEquals(updatedEngine.currentState.count, 45)
  })

  await test.step('should update engine frame tracking', () => {
    const initialState: TestState = { value: 0, count: 0 }
    const engine = createAnimationEngine(initialState, [])
    const frame = createFrame(20, 3000, 150)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(updatedEngine.frameCount, 150)
    assertEquals(updatedEngine.lastTime, 3000)
    assertEquals(updatedEngine.isRunning, false) // Should preserve other properties
  })
})

Deno.test('updateAnimationEngine - immutability', async (test) => {
  await test.step('should not modify original engine', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 999 })
    const engine = createAnimationEngine(initialState, [behavior])
    const originalEngine = { ...engine, currentState: { ...engine.currentState } }
    const frame = createFrame(16.67, 1000, 60)

    updateAnimationEngine(engine, frame)

    assertEquals(engine.currentState, originalEngine.currentState)
    assertEquals(engine.frameCount, originalEngine.frameCount)
    assertEquals(engine.lastTime, originalEngine.lastTime)
  })

  await test.step('should not modify frame data', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 999 })
    const engine = createAnimationEngine(initialState, [behavior])
    const frame = createFrame(16.67, 1000, 60)
    const originalFrame = { ...frame }

    updateAnimationEngine(engine, frame)

    assertEquals(frame, originalFrame)
  })
})

Deno.test('updateAnimationEngine - edge cases', async (test) => {
  await test.step('should handle behavior that returns same state', () => {
    const initialState: TestState = { value: 42, count: 7 }
    const behavior: AnimationBehavior<TestState> = (state) => state // Identity function
    const engine = createAnimationEngine(initialState, [behavior])
    const frame = createFrame(16.67, 1000, 60)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(updatedEngine.currentState, initialState)
    assertEquals(updatedEngine.frameCount, 60)
    assertEquals(updatedEngine.lastTime, 1000)
  })

  await test.step('should handle zero frame values', () => {
    const initialState: TestState = { value: 1, count: 1 }
    const behavior: AnimationBehavior<TestState> = (state, frame) => ({
      ...state,
      value: state.value + frame.deltaTime,
    })
    const engine = createAnimationEngine(initialState, [behavior])
    const frame = createFrame(0, 0, 0)

    const updatedEngine = updateAnimationEngine(engine, frame)

    assertEquals(updatedEngine.currentState.value, 1) // 1 + 0
    assertEquals(updatedEngine.frameCount, 0)
    assertEquals(updatedEngine.lastTime, 0)
  })
})
