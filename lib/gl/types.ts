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
  shadowLayer: ShadowLayer
}
