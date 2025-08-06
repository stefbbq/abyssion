import type { AnimationContext, SceneState } from '../core/types.ts'
import type { AnimationOrchestrator } from '../core/types.ts'
import { unregisterOrchestrator } from './unregisterOrchestrator.ts'
import { registerOrchestrator } from './registerOrchestrator.ts'

/**
 * Switches to a new page orchestrator in a pure, immutable way
 * Unregisters all current orchestrators and registers the new one (fallback to 'content-page' if not found)
 */
export const switchToPage = (
  sceneState: SceneState,
  registry: Record<string, () => AnimationOrchestrator>,
  pageName: string,
  context: AnimationContext,
): SceneState => {
  let newState = sceneState
  for (const name of sceneState.activeOrchestrators.keys()) {
    newState = unregisterOrchestrator(newState, name, context)
  }

  const targetPage = registry[pageName] ? pageName : 'content-page'
  return registerOrchestrator(newState, registry, targetPage)
}
