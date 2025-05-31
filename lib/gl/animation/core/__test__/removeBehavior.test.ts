import { assert, assertEquals } from '$std/assert/mod.ts'
import { removeBehavior } from '../removeBehavior.ts'
import { createAnimationEngine } from '../createAnimationEngine.ts'
import type { AnimationBehavior } from '../../types.ts'

type TestState = {
  value: number
  count: number
}

Deno.test('removeBehavior - basic functionality', async (test) => {
  await test.step('should remove behavior from engine with single behavior', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const engine = createAnimationEngine(initialState, [behavior])

    const newEngine = removeBehavior(engine, behavior)

    assertEquals(newEngine.behaviors.length, 0)
    assertEquals(newEngine.currentState, initialState)
    assertEquals(newEngine.isRunning, false)
    assertEquals(newEngine.frameCount, 0)
    assertEquals(newEngine.lastTime, 0)
  })

  await test.step('should remove specific behavior from engine with multiple behaviors', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count * 2 })
    const behavior3: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value - 1 })
    const engine = createAnimationEngine(initialState, [behavior1, behavior2, behavior3])

    const newEngine = removeBehavior(engine, behavior2)

    assertEquals(newEngine.behaviors.length, 2)
    assertEquals(newEngine.behaviors[0], behavior1)
    assertEquals(newEngine.behaviors[1], behavior3)
  })

  await test.step('should preserve all other engine properties', () => {
    const initialState: TestState = { value: 42, count: 7 }
    const behavior: AnimationBehavior<TestState> = (state) => state
    const engine = createAnimationEngine(initialState, [behavior])
    // Simulate engine with modified state
    const modifiedEngine = {
      ...engine,
      isRunning: true,
      frameCount: 150,
      lastTime: 8000,
    }

    const newEngine = removeBehavior(modifiedEngine, behavior)

    assertEquals(newEngine.currentState, initialState)
    assertEquals(newEngine.isRunning, true)
    assertEquals(newEngine.frameCount, 150)
    assertEquals(newEngine.lastTime, 8000)
    assertEquals(newEngine.behaviors.length, 0)
  })
})

Deno.test('removeBehavior - edge cases', async (test) => {
  await test.step('should handle removing behavior that does not exist', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const existingBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 999 })
    const nonExistentBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, count: 888 })
    const engine = createAnimationEngine(initialState, [existingBehavior])

    const newEngine = removeBehavior(engine, nonExistentBehavior)

    // Should not change anything
    assertEquals(newEngine.behaviors.length, 1)
    assertEquals(newEngine.behaviors[0], existingBehavior)
    assertEquals(newEngine.currentState, initialState)
  })

  await test.step('should handle removing from empty engine', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 999 })
    const engine = createAnimationEngine(initialState, [])

    const newEngine = removeBehavior(engine, behavior)

    assertEquals(newEngine.behaviors.length, 0)
    assertEquals(newEngine.currentState, initialState)
  })

  await test.step('should remove all occurrences of duplicate behaviors', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 1 })
    const otherBehavior: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count + 1 })
    const engine = createAnimationEngine(initialState, [behavior, otherBehavior, behavior])

    const newEngine = removeBehavior(engine, behavior)

    assertEquals(newEngine.behaviors.length, 1)
    assertEquals(newEngine.behaviors[0], otherBehavior) // Only otherBehavior remains
  })

  await test.step('should work with different state types', () => {
    // String state
    const stringBehavior: AnimationBehavior<string> = (state) => state + ' modified'
    const stringEngine = createAnimationEngine('initial', [stringBehavior])
    const newStringEngine = removeBehavior(stringEngine, stringBehavior)
    assertEquals(newStringEngine.behaviors.length, 0)
    assertEquals(newStringEngine.currentState, 'initial')

    // Number state
    const numberBehavior: AnimationBehavior<number> = (state) => state + 1
    const numberEngine = createAnimationEngine(42, [numberBehavior])
    const newNumberEngine = removeBehavior(numberEngine, numberBehavior)
    assertEquals(newNumberEngine.behaviors.length, 0)
    assertEquals(newNumberEngine.currentState, 42)
  })
})

Deno.test('removeBehavior - immutability', async (test) => {
  await test.step('should not modify original engine', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 999 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: 888 })
    const originalEngine = createAnimationEngine(initialState, [behavior1, behavior2])
    const originalBehaviorCount = originalEngine.behaviors.length

    removeBehavior(originalEngine, behavior1)

    // Original engine should be unchanged
    assertEquals(originalEngine.behaviors.length, originalBehaviorCount)
    assertEquals(originalEngine.behaviors[0], behavior1)
    assertEquals(originalEngine.behaviors[1], behavior2)
    assertEquals(originalEngine.currentState, initialState)
  })

  await test.step('should create new behaviors array', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: 2 })
    const engine = createAnimationEngine(initialState, [behavior1, behavior2])

    const newEngine = removeBehavior(engine, behavior1)

    // Should be different array instances
    assert(newEngine.behaviors !== engine.behaviors)
    assertEquals(newEngine.behaviors.length, engine.behaviors.length - 1)
  })

  await test.step('should not modify behavior parameter', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior: AnimationBehavior<TestState> = (state) => ({ ...state, value: 99 })
    const engine = createAnimationEngine(initialState, [behavior])
    const originalBehavior = behavior

    removeBehavior(engine, behavior)

    assertEquals(behavior, originalBehavior)
  })
})

Deno.test('removeBehavior - multiple removals', async (test) => {
  await test.step('should handle multiple sequential removals', () => {
    const initialState: TestState = { value: 0, count: 0 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, value: 2 })
    const behavior3: AnimationBehavior<TestState> = (state) => ({ ...state, value: 3 })
    let engine = createAnimationEngine(initialState, [behavior1, behavior2, behavior3])

    engine = removeBehavior(engine, behavior2)
    engine = removeBehavior(engine, behavior1)

    assertEquals(engine.behaviors.length, 1)
    assertEquals(engine.behaviors[0], behavior3)
  })

  await test.step('should handle removing all behaviors one by one', () => {
    const initialState: TestState = { value: 0, count: 0 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, value: 2 })
    let engine = createAnimationEngine(initialState, [behavior1, behavior2])

    engine = removeBehavior(engine, behavior1)
    engine = removeBehavior(engine, behavior2)

    assertEquals(engine.behaviors.length, 0)
    assertEquals(engine.currentState, initialState)
  })

  await test.step('should maintain correct order after removals', () => {
    const initialState: TestState = { value: 0, count: 0 }
    const behaviorA: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value + 10 })
    const behaviorB: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value * 2 })
    const behaviorC: AnimationBehavior<TestState> = (state) => ({ ...state, count: state.count + 1 })
    const behaviorD: AnimationBehavior<TestState> = (state) => ({ ...state, value: state.value - 5 })
    let engine = createAnimationEngine(initialState, [behaviorA, behaviorB, behaviorC, behaviorD])

    // Remove middle behavior
    engine = removeBehavior(engine, behaviorB)

    assertEquals(engine.behaviors.length, 3)
    assertEquals(engine.behaviors[0], behaviorA)
    assertEquals(engine.behaviors[1], behaviorC)
    assertEquals(engine.behaviors[2], behaviorD)
  })
})

Deno.test('removeBehavior - preserve readonly constraint', async (test) => {
  await test.step('should maintain readonly behaviors array', () => {
    const initialState: TestState = { value: 10, count: 5 }
    const behavior1: AnimationBehavior<TestState> = (state) => ({ ...state, value: 1 })
    const behavior2: AnimationBehavior<TestState> = (state) => ({ ...state, count: 2 })
    const engine = createAnimationEngine(initialState, [behavior1, behavior2] as const)

    const newEngine = removeBehavior(engine, behavior1)

    // Should maintain readonly behaviors array
    assertEquals(newEngine.behaviors.length, 1)
    assertEquals(newEngine.behaviors[0], behavior2)
    // TypeScript would catch any attempt to mutate the behaviors array
  })
})
