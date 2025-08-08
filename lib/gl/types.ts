import * as THREE from 'three'

import type { LogoLayer } from './layers/LogoLayer.ts'
import type { LogoController } from './layers/LogoLayer.ts'
import type { ShadowLayer } from './layers/ShadowLayer.ts'
import type { VideoBackgroundManager } from './textures/VideoCycle/types.ts'
import type { SceneOrchestrator } from './animation/types.ts'

/**
 * Type alias for the THREE.js library to avoid repetitive imports
 */
export type T_THREE = typeof THREE

/**
 * UI overlay that renders on top of the main 3D scene
 * Used for debug info, HUD elements, and other 2D overlays
 */
export type UIOverlay = {
  // The Three.js scene containing UI elements
  scene: THREE.Scene | null
  // Orthographic camera for pixel-perfect UI rendering
  camera: THREE.Camera | null
  // Updates the overlay dimensions when window resizes
  resize: (width: number, height: number) => void
}

/**
 * Options required to initialize the GL context and scene
 */
export type InitOptions = {
  // Path to the outline texture used for logo effects
  outlineTexturePath: string
  // Path to the stencil texture used for masking effects
  stencilTexturePath: string
  // HTML canvas element where the scene will be rendered
  canvas: HTMLCanvasElement
}

/**
 * Central state object containing all Three.js scene components and controllers
 * This acts as the single source of truth for the entire GL rendering system
 */
export type RendererState = {
  /**
   * Core Three.js components
   */

  // Main Three.js scene containing all 3D objects
  scene: THREE.Scene | null
  // Perspective camera for viewing the 3D scene
  camera: THREE.Camera | null
  // WebGL renderer responsible for drawing the scene
  renderer: THREE.WebGLRenderer | null
  // Post-processing composer that applies visual effects
  composer: THREE.EffectComposer | THREE.ShaderPass | null

  /**
   * Controls
   */

  // Optional orbit controls for camera manipulation (debug mode)
  controls?: THREE.OrbitControls | null

  /**
   * Post-processing passes
   */

  // Bloom effect pass for glowing elements
  bloomPass?: THREE.UnrealBloomPass | THREE.ShaderPass | null
  // Final compositing pass
  finalPass?: THREE.ShaderPass | null
  // Dithering pass for retro visual effects
  ditheringPass?: THREE.ShaderPass | null
  // Sharpening pass to enhance image clarity
  sharpeningPass?: THREE.ShaderPass | null
  // Pixelation effect for retro aesthetics
  pixelationPass?: THREE.ShaderPass | null
  // Pixel bleeding effect for CRT-style visuals
  pixelBleedPass?: THREE.ShaderPass | null
  // CRT monitor effect pass
  crtPass?: THREE.ShaderPass | null
  // Depth of field bokeh effect, dynamically adjusted based on focus
  bokehPass: THREE.ShaderPass | null

  /**
   * Logo system
   */

  // Controller managing logo layer animations and behaviors
  logoController: LogoController | null
  // Array of plane meshes displaying logo layers
  logoPlanes: THREE.Mesh[]
  // Logo layer instances with their configurations
  logoLayers: LogoLayer[]

  /**
   * Animation state
   */

  // Current animation time in seconds
  time: number

  /**
   * Geometry and textures
   */

  // Shared plane geometry used by multiple objects
  planeGeometry: THREE.PlaneGeometry | null
  // Texture used for logo outline effects
  outlineTexture: THREE.Texture | null
  // Texture used for stencil masking
  stencilTexture: THREE.Texture | null

  /**
   * References
   */

  // Reference to the THREE.js library
  THREE: T_THREE

  /**
   * UI and overlays
   */

  // 2D UI overlay rendered on top of the 3D scene
  uiOverlay: UIOverlay | null
  // Group containing geometric shape elements
  shapeLayer: THREE.Group | null

  /**
   * Background system
   */

  // Manager for video background textures and playback
  videoBackground?: VideoBackgroundManager | null

  /**
   * Shadow effects
   */

  // Shadow layer providing depth to logo elements
  shadowLayer: ShadowLayer | null

  /**
   * Scroll effects
   */

  // Randomized order for layer fade-out during scroll
  layerFadeOrder?: number[]

  /**
   * Lifecycle
   */

  // Cleanup function for responsive resize handlers
  responsiveCleanup?: () => void
  // Main orchestrator managing scene animations and transitions
  sceneOrchestrator: SceneOrchestrator | null
  // Indicates whether the GL context is fully initialized
  readonly isReady: boolean
}
