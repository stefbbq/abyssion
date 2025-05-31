import { assert, assertEquals } from '$std/assert/mod.ts'
import { addBehavior } from '../addBehavior.ts'
import { createAnimationEngine } from '../createAnimationEngine.ts'
import type { AnimationBehavior } from '../../types.ts'

type TestState = {
  value: number
  count: number
}

Deno.test('addBehavior - basic functionality', async (test) => {
  await test.step('should add behavior to empty engine', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const engine = createAnimationEngine(initialState)
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })

    const newEngine = addBehavior(engine, behavior)

    assertEquals(newEngine.behaviors.length, 1)
    assertEquals(newEngine.behaviors[0], behavior)
    assertEquals(newEngine.currentState, initialState)
    assertEquals(newEngine.isRunning, false)
    assertEquals(newEngine.frameCount, 0)
    assertEquals(newEngine.lastTime, 0)
  })

  await test.step('should add behavior to engine with existing behaviors', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const existingBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count + 1 })
    const engine = createAnimationEngine(initialState, [existingBehavior])
    const newBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value * 2 })

    const newEngine = addBehavior(engine, newBehavior)

    assertEquals(newEngine.behaviors.length, 2)
    assertEquals(newEngine.behaviors[0], existingBehavior)
    assertEquals(newEngine.behaviors[1], newBehavior)
  })

  await test.step('should preserve all other engine properties', () => {
    const initialState: TestState = { value: 42, count: 7 }
    const engine = createAnimationEngine(initialState)
    // Simulate engine with modified state
    const modifiedEngine = {
      ...engine,
      isRunning: true,
      frameCount: 100,
      lastTime: 5000,
    }
    const behavior: AnimationBehavior<TestState> = (state) => state

    const newEngine = addBehavior(modifiedEngine, behavior)

    assertEquals(newEngine.currentState, initialState)
    assertEquals(newEngine.isRunning, true)
    assertEquals(newEngine.frameCount, 100)
    assertEquals(newEngine.lastTime, 5000)
    assertEquals(newEngine.behaviors.length, 1)
  })
})

Deno.test('addBehavior - immutability', async (test) => {
  await test.step('should not modify original engine', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const originalBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 999 })
    const originalEngine = createAnimationEngine(initialState, [originalBehavior])
    const newBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, count: 888 })

    const originalBehaviorCount = originalEngine.behaviors.length

    addBehavior(originalEngine, newBehavior)

    // Original engine should be unchanged
    assertEquals(originalEngine.behaviors.length, originalBehaviorCount)
    assertEquals(originalEngine.behaviors[0], originalBehavior)
    assertEquals(originalEngine.currentState, initialState)
  })

  await test.step('should create new behaviors array', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const engine = createAnimationEngine(initialState, [behavior1])
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: 2 })

    const newEngine = addBehavior(engine, behavior2)

    // Should be different array instances
    assert(newEngine.behaviors !== engine.behaviors)
    assertEquals(newEngine.behaviors.length, engine.behaviors.length + 1)
  })

  await test.step('should not modify behavior parameter', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const engine = createAnimationEngine(initialState)
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 99 })
    const originalBehavior = behavior

    addBehavior(engine, behavior)

    assertEquals(behavior, originalBehavior)
  })
})

Deno.test('addBehavior - multiple additions', async (test) => {
  await test.step('should handle multiple sequential additions', () => {
    const initialState: TestState = { value: 0, count: 0 }
    let engine = createAnimationEngine(initialState)

    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, value: 2 })
    const behavior3: AnimationBehavior<TestState> = (state) => ({ ...state, value: 3 })

    engine = addBehavior(engine, behavior1)
    engine = addBehavior(engine, behavior2)
    engine = addBehavior(engine, behavior3)

    assertEquals(engine.behaviors.length, 3)
    assertEquals(engine.behaviors[0], behavior1)
    assertEquals(engine.behaviors[1], behavior2)
    assertEquals(engine.behaviors[2], behavior3)
  })

  await test.step('should maintain order of additions', () => {
    const initialState: TestState = { value: 0, count: 0 }
    const engine = createAnimationEngine(initialState)

    const behaviorA: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 10 })
    const behaviorB: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value * 2 })
    const behaviorC: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count + 1 })

    const result = addBehavior(addBehavior(addBehavior(engine, behaviorA), behaviorB), behaviorC)

    assertEquals(result.behaviors.length, 3)
    assertEquals(result.behaviors[0], behaviorA)
    assertEquals(result.behaviors[1], behaviorB)
    assertEquals(result.behaviors[2], behaviorC)
  })
})

Deno.test('addBehavior - edge cases', async (test) => {
  await test.step('should handle same behavior added multiple times', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const engine = createAnimationEngine(initialState)
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })

    const engine1 = addBehavior(engine, behavior)
    const engine2 = addBehavior(engine1, behavior)

    assertEquals(engine2.behaviors.length, 2)
    assertEquals(engine2.behaviors[0], behavior)
    assertEquals(engine2.behaviors[1], behavior)
  })

  await test.step('should work with different state types', () => {
    // String state
    const stringEngine = createAnimationEngine('initial')
    const stringBehavior: AnimationBehavior<string> = (state) => state + ' modified'
    const newStringEngine = addBehavior(stringEngine, stringBehavior)
    assertEquals(newStringEngine.behaviors.length, 1)
    assertEquals(newStringEngine.currentState, 'initial')

    // Number state
    const numberEngine = createAnimationEngine(42)
    const numberBehavior: AnimationBehavior<number> = (state) => state + 1
    const newNumberEngine = addBehavior(numberEngine, numberBehavior)
    assertEquals(newNumberEngine.behaviors.length, 1)
    assertEquals(newNumberEngine.currentState, 42)
  })

  await test.step('should preserve readonly constraint', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: 2 })
    const engine = createAnimationEngine(initialState, [behavior1] as const)

    const newEngine = addBehavior(engine, behavior2)

    // Should maintain readonly behaviors array
    assertEquals(newEngine.behaviors.length, 2)
    // TypeScript would catch any attempt to mutate the behaviors array
  })
})
