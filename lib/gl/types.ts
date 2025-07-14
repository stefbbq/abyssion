import * as Three from 'three'
import type { Camera, EffectComposer, Group, Mesh, OrbitControls, Scene, ShaderPass, UnrealBloomPass, WebGLRenderer } from 'three'
import type { LogoLayer } from './layers/LogoLayer.ts'
import type { LogoController } from './layers/LogoLayer.ts'
import type { ShadowLayer } from './layers/ShadowLayer.ts'

// Video background manager type
export type VideoBackgroundManager = {
  update: (delta: number) => void
  dispose: () => void
  mesh: Mesh // The mesh containing the video texture
  handleResize: () => void
  updateThemeColors?: () => void // Update theme colors in real-time
  getDebugInfo?: () => VideoDebugInfo // Get debug information about video state
}

// Video debug information
export type VideoDebugInfo = {
  isPlaying: boolean
  currentVideoIndex: number
  currentVideoName: string
  currentVideoSrc: string
  timeSinceSwitch: number // in milliseconds
  currentDuration: number // in seconds (visible segment duration)
  fullVideoDuration: number // in seconds (actual video file duration)
  videoStartTime: number // in seconds (where the visible segment starts)
  totalVideos: number
  recentIndices: readonly number[]
  nextPreparedIndex: number | null
  isTransitioning: boolean
  loadingProgress: {
    loaded: number
    total: number
    hasMoreToLoad: boolean
  }
}

// UI Overlay type
export type UIOverlay = {
  scene: Scene
  camera: Camera
  resize: (width: number, height: number) => void
}

// Initialization options
export type InitOptions = {
  outlineTexturePath: string
  stencilTexturePath: string
  canvas: HTMLCanvasElement
}

// Renderer state
export type RendererState = {
  scene: Scene
  camera: Camera
  renderer: WebGLRenderer
  composer: EffectComposer
  controls?: OrbitControls
  bloomPass: UnrealBloomPass
  finalPass: ShaderPass
  ditheringPass: ShaderPass
  sharpeningPass: ShaderPass
  logoController: LogoController
  logoPlanes: Mesh[]
  logoLayers: LogoLayer[]
  time: number
  planeGeometry: Three.PlaneGeometry
  outlineTexture: Three.Texture
  stencilTexture: Three.Texture
  THREE: typeof Three
  uiOverlay: UIOverlay
  shapeLayer: Group
  videoBackground?: VideoBackgroundManager
  pixelationPass: ShaderPass
  pixelBleedPass: ShaderPass
  crtPass: ShaderPass
  shadowLayer: ShadowLayer
  /** bokeh pass for DOF, dynamically updated in animation loop */
  bokehPass: any
  /** random order for layer fade-out effect during scroll */
  layerFadeOrder?: number[]
}
