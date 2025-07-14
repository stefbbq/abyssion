import type { AnimationContext, SceneState } from '../core/types.ts'

/**
 * Runs update on all active orchestrators in the scene state
 * Returns the same SceneState (for consistency)
 */
export const stepOrchestrators = (
  sceneState: SceneState,
  context: AnimationContext,
): SceneState => {
  sceneState.activeOrchestrators.forEach((orchestrator) => orchestrator.update(context))
  return sceneState
}
