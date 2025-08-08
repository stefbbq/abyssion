import type { SceneState } from '../core/types.ts'
import type { AnimationOrchestrator } from '../core/types.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Registers an orchestrator in a pure, immutable way
 * Returns a new SceneState with the orchestrator added
 */
export const registerOrchestrator = (
  sceneState: SceneState,
  orchestrator: AnimationOrchestrator,
): SceneState => {
  log(lc.GL_ANIMATION, `Registering orchestrator: ${orchestrator.name}`)

  // add orchestrator to map
  const newMap = new Map(sceneState.activeOrchestrators)
  newMap.set(orchestrator.name, orchestrator)

  // return new state with updated orchestrators map
  log(lc.GL_ANIMATION, `Successfully registered orchestrator: ${orchestrator.name}, total active: ${newMap.size}`)
  return { ...sceneState, activeOrchestrators: newMap }
}
