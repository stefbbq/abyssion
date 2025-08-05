import * as THREE from 'three'
import type {
  Camera,
  EffectComposer,
  Group,
  Mesh,
  OrbitControls,
  PlaneGeometry,
  Scene,
  ShaderPass,
  Texture,
  UnrealBloomPass,
  WebGLRenderer,
} from 'three'
import type { LogoLayer } from './layers/LogoLayer.ts'
import type { LogoController } from './layers/LogoLayer.ts'
import type { ShadowLayer } from './layers/ShadowLayer.ts'
import type { VideoBackgroundManager } from './textures/VideoCycle/types.ts'
import type { SceneOrchestrator } from './animation/types.ts'

export type T_THREE = typeof THREE

// UI Overlay type
export type UIOverlay = {
  scene: Scene | null
  camera: Camera | null
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
  scene: Scene | null
  camera: Camera | null
  renderer: WebGLRenderer | null
  composer: EffectComposer | ShaderPass | null
  controls?: OrbitControls | null
  bloomPass?: UnrealBloomPass | ShaderPass | null
  finalPass?: ShaderPass | null
  ditheringPass?: ShaderPass | null
  sharpeningPass?: ShaderPass | null
  logoController: LogoController | null
  logoPlanes: Mesh[]
  logoLayers: LogoLayer[]
  time: number
  planeGeometry: PlaneGeometry | null
  outlineTexture: Texture | null
  stencilTexture: Texture | null
  THREE: T_THREE
  uiOverlay: UIOverlay | null
  shapeLayer: Group | null
  videoBackground?: VideoBackgroundManager | null
  pixelationPass?: ShaderPass | null
  pixelBleedPass?: ShaderPass | null
  crtPass?: ShaderPass | null
  shadowLayer: ShadowLayer | null
  /** bokeh pass for DOF, dynamically updated in animation loop */
  bokehPass: ShaderPass | null
  /** random order for layer fade-out effect during scroll */
  layerFadeOrder?: number[]
  responsiveCleanup?: () => void
  sceneOrchestrator: SceneOrchestrator | null
  readonly isReady: boolean
}
