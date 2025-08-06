import type { SceneState } from '../core/types.ts'
import type { AnimationOrchestrator } from '../core/types.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Registers an orchestrator by name in a pure, immutable way
 * Returns a new SceneState with the orchestrator added if found in the registry
 */
export const registerOrchestrator = (
  sceneState: SceneState,
  registry: Record<string, () => AnimationOrchestrator>,
  name: string,
): SceneState => {
  log(lc.GL_ANIMATION, `Registering orchestrator: ${name}`)
  const orchestratorFactory = registry[name]
  if (!orchestratorFactory) {
    log.error(lc.GL_ANIMATION, `Orchestrator factory not found for: ${name}`)
    return sceneState
  }
  const orchestrator = orchestratorFactory()
  const newMap = new Map(sceneState.activeOrchestrators)
  newMap.set(orchestrator.name, orchestrator)
  log(lc.GL_ANIMATION, `Successfully registered orchestrator: ${orchestrator.name}, total active: ${newMap.size}`)
  return { ...sceneState, activeOrchestrators: newMap }
}
