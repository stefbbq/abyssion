import { assertEquals } from '$std/assert/mod.ts'
import { createAnimationEngine } from '../createAnimationEngine.ts'
import type { AnimationBehavior } from '../../types.ts'

type TestState = {
  value: number
  count: number
}

Deno.test('createAnimationEngine - basic creation', async (test) => {
  await test.step('should create engine with initial state', () => {
    const initialState: TestState = { value: 10, count: 0 }
    const engine = createAnimationEngine(initialState)

    assertEquals(engine.currentState, initialState)
    assertEquals(engine.behaviors.length, 0)
    assertEquals(engine.isRunning, false)
    assertEquals(engine.frameCount, 0)
    assertEquals(engine.lastTime, 0)
  })

  await test.step('should create engine with behaviors', () => {
    const initialState: TestState = { value: 5, count: 1 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count + 1 })
    const behaviors = [behavior1, behavior2] as const

    const engine = createAnimationEngine(initialState, behaviors)

    assertEquals(engine.currentState, initialState)
    assertEquals(engine.behaviors, behaviors)
    assertEquals(engine.isRunning, false)
    assertEquals(engine.frameCount, 0)
    assertEquals(engine.lastTime, 0)
  })
})

Deno.test('createAnimationEngine - immutability', async (test) => {
  await test.step('should not modify initial state', () => {
    const initialState: TestState = { value: 10, count: 0 }
    const originalState = { ...initialState }

    createAnimationEngine(initialState)

    assertEquals(initialState, originalState)
  })

  await test.step('should not modify behaviors array', () => {
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const behaviors = [behavior]
    const originalBehaviors = [...behaviors]

    createAnimationEngine({ value: 0, count: 0 }, behaviors)

    assertEquals(behaviors, originalBehaviors)
  })
})

Deno.test('createAnimationEngine - type safety', async (test) => {
  await test.step('should work with different state types', () => {
    // String state
    const stringEngine = createAnimationEngine('initial')
    assertEquals(stringEngine.currentState, 'initial')

    // Number state
    const numberEngine = createAnimationEngine(42)
    assertEquals(numberEngine.currentState, 42)

    // Object state
    const objectState = { x: 1, y: 2, name: 'test' }
    const objectEngine = createAnimationEngine(objectState)
    assertEquals(objectEngine.currentState, objectState)
  })

  await test.step('should preserve readonly behaviors constraint', () => {
    const behavior: AnimationBehavior<number> = (state) => state + 1
    const behaviors = [behavior] as const

    const engine = createAnimationEngine(0, behaviors)

    // This should be readonly - the TypeScript compiler would catch attempts to mutate
    assertEquals(engine.behaviors.length, 1)
  })
})
