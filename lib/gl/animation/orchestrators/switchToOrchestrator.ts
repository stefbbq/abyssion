import type { AnimationContext, SceneState } from '../core/types.ts'
import type { AnimationOrchestrator } from '../core/types.ts'
import { unregisterOrchestrator } from './unregisterOrchestrator.ts'
import { registerOrchestrator } from './registerOrchestrator.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Switches to a new orchestrator in a pure, immutable way
 * Unregisters all current orchestrators and registers the new one
 */
export const switchToOrchestrator = (
  sceneState: SceneState,
  orchestrator: AnimationOrchestrator,
  context: AnimationContext,
): SceneState => {
  log(
    lc.GL_ANIMATION,
    `Switching to orchestrator: ${orchestrator.name}, current active: [${Array.from(sceneState.activeOrchestrators.keys()).join(', ')}]`,
  )

  // unregister all current orchestrators
  let newState = sceneState
  for (const name of sceneState.activeOrchestrators.keys()) {
    newState = unregisterOrchestrator(newState, name, context)
  }

  // register new orchestrator
  log(lc.GL_ANIMATION, `Registering new orchestrator: ${orchestrator.name}`)
  return registerOrchestrator(newState, orchestrator)
}
