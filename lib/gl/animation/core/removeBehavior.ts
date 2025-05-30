import type { AnimationBehavior, AnimationEngineState } from '../types.ts'

/**
 * Removes a behavior from animation engine
 * Pure function - returns new engine state with behavior removed
 */
export const removeBehavior = <T>(
  engine: AnimationEngineState<T>,
  behavior: AnimationBehavior<T>,
): AnimationEngineState<T> => ({
  ...engine,
  behaviors: engine.behaviors.filter((b) => b !== behavior),
})
