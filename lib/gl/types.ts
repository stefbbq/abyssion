/**
 * Logo3D main types
 *
 * Core type definitions used across multiple modules
 */

import type { Camera, Group, Mesh, Scene, WebGLRenderer } from 'three'
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import type { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import type { LogoLayer } from './layers/LogoLayer.ts'

// Video background manager type
export type VideoBackgroundManager = {
  update: (delta: number) => void
  dispose: () => void
  mesh: Mesh // The mesh containing the video texture
}

// Shadow layer type
export type ShadowLayer = {
  mesh: Mesh // The mesh containing the shadow
  dispose: () => void
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
  controls: OrbitControls
  bloomPass: UnrealBloomPass
  finalPass: ShaderPass
  ditheringPass: ShaderPass
  sharpeningPass: ShaderPass
  planes: Mesh[]
  layers: LogoLayer[]
  time: number
  planeGeometry: any
  outlineTexture: any
  stencilTexture: any
  THREE: any
  uiOverlay: UIOverlay
  shapeLayer: Group
  videoBackground?: VideoBackgroundManager
}

// Bloom parameters
export type BloomParams = {
  exposure: number
  bloomStrength: number
  bloomThreshold: number
  bloomRadius: number
}
