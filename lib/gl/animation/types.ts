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
