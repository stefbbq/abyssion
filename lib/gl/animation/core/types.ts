import type { RendererState } from '../../types.ts'
import type { SharedBehaviors } from './createSharedBehaviors.ts'

/**
 * Animation orchestrator context - what each orchestrator receives
 */
export type AnimationContext = {
  readonly state: RendererState
  readonly shared: SharedBehaviors
  readonly time: number
  readonly deltaTime: number
}

/**
 * Animation orchestrator interface - what each page orchestrator must implement
 */
export type AnimationOrchestrator = {
  readonly name: string
  readonly update: (context: AnimationContext) => void
  readonly dispose: () => void
}

/**
 * Scene transition state
 */
export type TransitionState = {
  readonly isTransitioning: boolean
  readonly progress: number // 0 to 1
  readonly fromPage: string | null
  readonly toPage: string | null
}

/**
 * Scene orchestrator state
 */
export type SceneState = {
  readonly activeOrchestrators: Map<string, AnimationOrchestrator>
  readonly transition: TransitionState
}
