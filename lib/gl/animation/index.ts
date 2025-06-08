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
export { createEmptyPageOrchestrator } from './orchestrators/createEmptyPageOrchestrator.ts'

// Pure calculation functions (reusable across orchestrators)
export { calculateStaticLayerPosition } from './calculations/calculateStaticLayerPosition.ts'
export { calculateRandomLayerPosition } from './calculations/calculateRandomLayerPosition.ts'
export { calculateShaderTime } from './calculations/calculateShaderTime.ts'
export { calculateBloomEffect } from './calculations/calculateBloomEffect.ts'
export { calculateRegenerationTiming } from './calculations/calculateRegenerationTiming.ts'
export { calculateRotationInterpolation } from './calculations/calculateRotationInterpolation.ts'
