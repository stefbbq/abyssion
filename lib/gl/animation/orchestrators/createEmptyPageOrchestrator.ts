import type { AnimationContext, AnimationOrchestrator } from '../core/types.ts'

/**
 * An orchestrator for pages with no special GL animations.
 * It provides the necessary interface but performs no actions.
 */
export const createEmptyPageOrchestrator = (): AnimationOrchestrator => {
  return {
    name: 'empty-page',
    update: () => {
      // No-op
    },
    dispose: (_context: AnimationContext) => {
      // No-op
    },
  }
}
