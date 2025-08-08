/**
 * @module Animation system
 * @description Scene orchestrator with composable page-specific animation systems
 */

export { createSceneOrchestrator } from './createSceneOrchestrator.ts'
export { createSharedBehaviors } from './core/createSharedBehaviors.ts'
export type { AnimationContext, AnimationOrchestrator, SceneState, TransitionState } from './core/types.ts'

// Page orchestrators
export { createHomePageOrchestrator } from './orchestrators/homePage/createHomePageOrchestrator.ts'
export { createContentPageOrchestrator } from './orchestrators/contentPage/createContentPageOrchestrator.ts'

// Pure calculation functions
export { calculateRotationInterpolation } from './calculations/calculateRotationInterpolation.ts'
export { calculateScrollProgress } from './calculations/calculateScrollProgress.ts'
export { calculateShaderTime } from './calculations/calculateShaderTime.ts'
export { calculateMouseRotation } from './calculations/calculateMouseRotation.ts'
;``
