import type { AnimationContext, SceneState } from '../core/types.ts'
import { lc, log } from '@lib/logger/index.ts'

// Track frame count for debugging
let frameCount = 0

/**
 * Runs update on all active orchestrators in the scene state
 * Returns the same SceneState (for consistency)
 */
export const stepOrchestrators = (
  sceneState: SceneState,
  context: AnimationContext,
): SceneState => {
  frameCount++

  if (frameCount % 60 === 1) { // Log every 60 frames (roughly 1 second)
    const activeNames = Array.from(sceneState.activeOrchestrators.keys())
    if (activeNames.length > 0) {
      log.debug(lc.GL_ANIMATION, `Frame ${frameCount}: Stepping orchestrators: [${activeNames.join(', ')}]`)
    } else {
      log.warn(lc.GL_ANIMATION, `Frame ${frameCount}: No active orchestrators!`)
    }
  }

  sceneState.activeOrchestrators.forEach((orchestrator) => {
    try {
      orchestrator.update(context)
    } catch (error) {
      log.error(lc.GL_ANIMATION, `Error in orchestrator ${orchestrator.name}:`, error)
    }
  })

  return sceneState
}
