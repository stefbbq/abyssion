/**
 * Animation types
 */

import type { RendererState } from '../types.ts'

/**
 * Animation frame callback for backward compatibility
 */
export type AnimationFrameCallback = (state: RendererState, deltaTime: number) => void

/**
 * Immutable animation frame data
 */
export type AnimationFrame = {
  readonly deltaTime: number
  readonly totalTime: number
  readonly frameCount: number
}

/**
 * Pure animation behavior function
 */
export type AnimationBehavior<T> = (state: T, frame: AnimationFrame) => T

/**
 * Animation engine state
 */
export type AnimationEngineState<T> = {
  readonly currentState: T
  readonly behaviors: readonly AnimationBehavior<T>[]
  readonly isRunning: boolean
  readonly frameCount: number
  readonly lastTime: number
}

/**
 * Mouse interaction state
 */
export type MouseState = {
  readonly x: number
  readonly y: number
  readonly targetRotationX: number
  readonly targetRotationY: number
}

/**
 * Layer regeneration state
 */
export type RegenerationState = {
  readonly lastRegenerateTime: number
  readonly nextRegenerateInterval: number
}

/**
 * Post-processing state
 */
export type PostProcessingState = {
  readonly bloomOverrideActive: boolean
  readonly bloomOverrideStartTime: number
  readonly bloomOverrideDuration: number
}

/**
 * Complete logo animation state
 */
export type LogoAnimationState = {
  readonly mouse: MouseState
  readonly regeneration: RegenerationState
  readonly postProcessing: PostProcessingState
  readonly timeScale: number
}

/**
 * Dependencies for logo animation (immutable)
 */
export type LogoAnimationDependencies = {
  readonly scene: any
  readonly renderer: any
  readonly composer: any
  readonly controls: any
  planes: any[]
  layers: any[]
  readonly planeGeometry: any
  readonly outlineTexture: any
  readonly stencilTexture: any
  readonly videoBackground?: any
  readonly finalPass: any
  readonly bloomPass: any
  readonly ditheringPass: any
  readonly sharpeningPass: any
  readonly THREE: any
}
