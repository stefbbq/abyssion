import type { AnimationBehavior, AnimationEngineState } from '../types.ts'

/**
 * Adds a behavior to animation engine
 * Pure function - returns new engine state with added behavior
 */
export const addBehavior = <T>(
  engine: AnimationEngineState<T>,
  behavior: AnimationBehavior<T>,
): AnimationEngineState<T> => ({
  ...engine,
  behaviors: [...engine.behaviors, behavior],
})
