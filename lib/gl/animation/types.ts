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

export type SceneOrchestrator = {
  registerOrchestrator: (name: string) => void
  unregisterOrchestrator: (name: string) => void
  switchToPage: (pageName: string) => void
  setRenderState: (state: import('../types.ts').RendererState) => void
  getActiveOrchestrators: () => string[]
  start: () => void
  dispose: () => void
}
