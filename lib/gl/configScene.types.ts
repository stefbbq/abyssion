/** Renderer configuration */
export type RendererConfig = {
  /** Pixel ratio multiplier */
  pixelRatioMultiplier: number
  /** Maximum pixel ratio */
  pixelRatioMax: number
  /** Whether to enable antialiasing */
  antialias: boolean
  /** Whether to enable alpha transparency */
  alpha: boolean
  /** Renderer exposure (overall scene brightness) */
  exposure: number
}

/** Complete scene configuration */
export type ConfigScene = {
  /** Logo aspect ratio */
  logoAspectRatio: number
  /** Plane width in world units */
  planeWidth: number
  /** Plane height in world units */
  planeHeight: number
  /** Renderer configuration */
  rendererConfig: RendererConfig
  /** Whether post-processing is enabled */
  postProcessingEnabled?: boolean
}

declare const configScene: ConfigScene
export default ConfigScene
