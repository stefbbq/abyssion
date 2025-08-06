import type { AnimationContext, SceneState } from '../core/types.ts'
import type { AnimationOrchestrator } from '../core/types.ts'
import { unregisterOrchestrator } from './unregisterOrchestrator.ts'
import { registerOrchestrator } from './registerOrchestrator.ts'
import { lc, log } from '@lib/logger/index.ts'

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
  log(lc.GL_ANIMATION, `Switching to page: ${pageName}, current active: [${Array.from(sceneState.activeOrchestrators.keys()).join(', ')}]`)

  let newState = sceneState
  for (const name of sceneState.activeOrchestrators.keys()) {
    newState = unregisterOrchestrator(newState, name, context)
  }

  const targetPage = registry[pageName] ? pageName : 'content-page'
  if (targetPage !== pageName) {
    log.warn(lc.GL_ANIMATION, `Page ${pageName} not found in registry, falling back to: ${targetPage}`)
  }
  log(lc.GL_ANIMATION, `Registering new page orchestrator: ${targetPage}`)
  return registerOrchestrator(newState, registry, targetPage)
}
