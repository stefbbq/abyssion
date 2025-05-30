/**
 * Animation system
 * Scene orchestrator with composable page-specific animation systems
 */

// Core scene orchestrator system
export { createSceneOrchestrator } from './createSceneOrchestrator.ts'
export { createSharedBehaviors } from './core/createSharedBehaviors.ts'
export type { AnimationContext, AnimationOrchestrator, SceneState, TransitionState } from './core/types.ts'

// Page orchestrators
export { createLogoPageOrchestrator } from './orchestrators/createLogoPageOrchestrator.ts'
export { createPortfolioPageOrchestrator } from './orchestrators/createPortfolioPageOrchestrator.ts'

// Pure calculation functions (reusable across orchestrators)
export { calculateStaticLayerPosition } from './calculations/calculateStaticLayerPosition.ts'
export { calculateRandomLayerPosition } from './calculations/calculateRandomLayerPosition.ts'
export { calculateShaderTime } from './calculations/calculateShaderTime.ts'
export { calculateBloomEffect } from './calculations/calculateBloomEffect.ts'
export { calculateRegenerationTiming } from './calculations/calculateRegenerationTiming.ts'
export { calculateRotationInterpolation } from './calculations/calculateRotationInterpolation.ts'

// Legacy compatibility
import type { RendererState } from '../types.ts'
import { createSceneOrchestrator } from './createSceneOrchestrator.ts'
import { createLogoPageOrchestrator } from './orchestrators/createLogoPageOrchestrator.ts'

/**
 * Initialize the animation system with the logo page as default
 * Legacy export for compatibility with existing code
 */
export const startAnimationLoop = (state: RendererState) => {
  const sceneOrchestrator = createSceneOrchestrator(state)

  // Register and activate the logo page by default
  const logoPage = createLogoPageOrchestrator()
  sceneOrchestrator.registerOrchestrator(logoPage)

  // Return cleanup function
  return sceneOrchestrator.dispose
}
