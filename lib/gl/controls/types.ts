/**
 * Controls module types
 * Pure type definitions for mouse controls and orbit camera controls
 */

/**
 * Mouse position normalized to -1 to 1 range
 */
export type MousePosition = {
  readonly x: number
  readonly y: number
}

/**
 * Target rotation values calculated from mouse position
 */
export type MouseRotationTarget = {
  readonly targetRotationX: number
  readonly targetRotationY: number
}

/**
 * Mouse tracking system state
 */
export type MouseTrackingState = {
  readonly currentTarget: MouseRotationTarget
  readonly isActive: boolean
}

/**
 * Orbit controls configuration
 */
export type OrbitControlsConfig = {
  readonly enableDamping: boolean
  readonly dampingFactor: number
  readonly rotateSpeed: number
  readonly enableZoom: boolean
  readonly zoomSpeed: number
  readonly minDistance: number
  readonly maxDistance: number
  readonly enablePan: boolean
  readonly panSpeed: number
  readonly autoRotate: boolean
  readonly autoRotateSpeed: number
}

/**
 * Keyboard input configuration
 */
export type KeyboardInputConfig = {
  readonly toggleRotation: readonly string[]
  readonly regenerateLayers: readonly string[]
}

/**
 * Controls system dependencies
 */
export type ControlsDependencies = {
  readonly camera: any // Three.js Camera type
  readonly domElement: HTMLElement
  readonly config: OrbitControlsConfig
  readonly keyboardConfig: KeyboardInputConfig
}
