import type { SceneState } from '../core/types.ts'
import type { AnimationOrchestrator } from '../core/types.ts'

/**
 * Registers an orchestrator by name in a pure, immutable way
 * Returns a new SceneState with the orchestrator added if found in the registry
 */
export const registerOrchestrator = (
  sceneState: SceneState,
  registry: Record<string, () => AnimationOrchestrator>,
  name: string,
): SceneState => {
  const orchestratorFactory = registry[name]
  if (!orchestratorFactory) return sceneState
  const orchestrator = orchestratorFactory()
  const newMap = new Map(sceneState.activeOrchestrators)
  newMap.set(orchestrator.name, orchestrator)
  return { ...sceneState, activeOrchestrators: newMap }
}
