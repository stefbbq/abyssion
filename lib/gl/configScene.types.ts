/** Parameters for controlling the bloom post-processing effect */
export type BloomParams = {
  /** Controls the intensity of the bloom glow effect */
  bloomStrength: number
  /** Minimum brightness threshold for pixels to bloom */
  bloomThreshold: number
  /** Controls how far the bloom effect spreads */
  bloomRadius: number
  /** Multiplier for bloom strength */
  bloomStrengthMultiplier: number
  /** Multiplier for bloom threshold */
  bloomThresholdMultiplier: number
  /** Override threshold value */
  thresholdOverride: number
}

/** Parameters for controlling the bokeh/depth of field effect */
export type BokehParams = {
  /** Focus distance */
  focus: number
  /** Aperture size (smaller = more blur) */
  aperture: number
  /** Maximum blur amount */
  maxblur: number
}

/** Parameters for film grain effect */
export type FilmParams = {
  /** Intensity of noise/grain */
  noiseIntensity: number
  /** Intensity of scanlines */
  scanlineIntensity: number
  /** Number of scanlines */
  scanlineCount: number
  /** Whether to apply grayscale effect */
  grayscale: boolean
}

/** Parameters for final color grading pass */
export type FinalPassParams = {
  /** Chromatic aberration strength */
  chromaStrength: number
  /** Dithering strength */
  ditherStrength: number
  /** Dithering frequency */
  ditherFrequency: number
  /** Dithering animation amount */
  ditherAnimation: number
  /** Gain/brightness multiplier for final pass (default 1.0) */
  gain?: number
}

/** Parameters for sharpening effect */
export type SharpeningParams = {
  /** Sharpening strength */
  strength: number
  /** Whether sharpening is enabled */
  enabled: boolean
}

/** Parameters for lens flare effects */
export type LensFlareParams = {
  /** Light source intensity */
  lightIntensity: number
  /** Light source distance */
  lightDistance: number
  /** Light source position [x, y, z] */
  lightPosition: number[]
  /** Main flare configuration */
  mainFlare: {
    size: number
    intensity: number
    colorHex: number
  }
  /** Secondary flare configuration */
  secondaryFlare: {
    size: number
    intensity: number
    position: number
    colorHex: number
  }
  /** Tertiary flare configuration */
  tertiaryFlare: {
    size: number
    intensity: number
    position: number
    colorHex: number
  }
}

/** Parameters for pixelation effect */
export type PixelateParams = {
  /** Whether pixelation is enabled */
  enabled: boolean
  /** Size of each pixel block */
  pixelSize: number
}

/** Complete post-processing configuration */
export type PostProcessingConfig = {
  /** Bokeh/depth of field parameters */
  bokeh: BokehParams
  /** Bloom effect parameters */
  bloom: BloomParams
  /** Film grain parameters */
  film: FilmParams
  /** Final pass parameters */
  finalPass: FinalPassParams
  /** Sharpening parameters */
  sharpening: SharpeningParams
  /** Pixelation parameters */
  pixelate?: PixelateParams
  /** Lens flare parameters */
  lensFlare: LensFlareParams
}

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
  /** Post-processing configuration */
  postProcessingConfig: PostProcessingConfig
}

declare const configScene: ConfigScene
export default configScene
