import type { AnimationEngineState, AnimationFrame } from '../types.ts'

/**
 * Updates animation engine state by applying all behaviors
 * Pure function - no side effects, returns new engine state
 */
export const updateAnimationEngine = <T>(
  engine: AnimationEngineState<T>,
  frame: AnimationFrame,
): AnimationEngineState<T> => {
  const newState = engine.behaviors.reduce(
    (state, behavior) => behavior(state, frame),
    engine.currentState,
  )

  return {
    ...engine,
    currentState: newState,
    frameCount: frame.frameCount,
    lastTime: frame.totalTime,
  }
}
