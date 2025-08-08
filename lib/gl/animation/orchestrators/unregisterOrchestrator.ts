import type { SceneState } from '../core/types.ts'
import type { AnimationContext } from '../core/types.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Unregisters an orchestrator by name in a pure, immutable way
 * Calls dispose on the orchestrator if found, and returns a new SceneState
 */
export const unregisterOrchestrator = (
  sceneState: SceneState,
  name: string,
  context: AnimationContext,
): SceneState => {
  log(lc.GL_ANIMATION, `Unregistering orchestrator: ${name}`)

  // get orchestrator by name
  const orchestrator = sceneState.activeOrchestrators.get(name)
  if (!orchestrator) {
    log.warn(lc.GL_ANIMATION, `Orchestrator ${name} not found`)
    return sceneState
  }

  // dispose of orchestrator
  orchestrator.dispose(context)
  const newMap = new Map(sceneState.activeOrchestrators)
  newMap.delete(name)

  // Return new state with updated orchestrators map
  return { ...sceneState, activeOrchestrators: newMap }
}
