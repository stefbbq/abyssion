import type { AnimationBehavior, AnimationEngineState } from '../types.ts'

/**
 * Creates an immutable animation engine state
 * Pure function - no side effects, returns new engine state
 */
export const createAnimationEngine = <T>(
  initialState: T,
  behaviors: readonly AnimationBehavior<T>[] = [],
): AnimationEngineState<T> => ({
  currentState: initialState,
  behaviors,
  isRunning: false,
  frameCount: 0,
  lastTime: 0,
})
