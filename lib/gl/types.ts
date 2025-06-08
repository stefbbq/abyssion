import * as Three from 'three'
import type { Camera, EffectComposer, Group, Mesh, OrbitControls, Scene, ShaderPass, UnrealBloomPass, WebGLRenderer } from 'three'
import type { LogoLayer } from './layers/LogoLayer.ts'

// Video background manager type
export type VideoBackgroundManager = {
  update: (delta: number) => void
  dispose: () => void
  mesh: Mesh // The mesh containing the video texture
}

// UI Overlay type
export type UIOverlay = {
  scene: Scene
  camera: Camera
  resize: (width: number, height: number) => void
}

// Initialization options
export type InitOptions = {
  width: number
  height: number
  outlineTexturePath: string
  stencilTexturePath: string
  container: HTMLDivElement
}

// Renderer state
export type RendererState = {
  scene: Scene
  camera: Camera
  renderer: WebGLRenderer
  composer: EffectComposer
  controls: OrbitControls | null
  bloomPass: UnrealBloomPass
  finalPass: ShaderPass
  ditheringPass: ShaderPass
  sharpeningPass: ShaderPass
  planes: Mesh[]
  logoLayers: LogoLayer[]
  time: number
  planeGeometry: any
  outlineTexture: any
  stencilTexture: any
  THREE: typeof Three
  uiOverlay: UIOverlay
  shapeLayer: Group
  videoBackground?: VideoBackgroundManager
}
