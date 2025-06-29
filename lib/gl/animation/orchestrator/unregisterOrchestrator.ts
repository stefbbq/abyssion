import type { SceneState } from '../core/types.ts'
import type { AnimationContext } from '../core/types.ts'

/**
 * Unregisters an orchestrator by name in a pure, immutable way
 * Calls dispose on the orchestrator if found, and returns a new SceneState
 */
export const unregisterOrchestrator = (
  sceneState: SceneState,
  name: string,
  context: AnimationContext,
): SceneState => {
  const orchestrator = sceneState.activeOrchestrators.get(name)
  if (!orchestrator) return sceneState
  orchestrator.dispose(context)
  const newMap = new Map(sceneState.activeOrchestrators)
  newMap.delete(name)
  return { ...sceneState, activeOrchestrators: newMap }
}
