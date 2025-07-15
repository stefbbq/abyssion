/** Parameters for controlling the bloom post-processing effect */
export type BloomSwellParams = {
  enabled: boolean
  pulseFrequency: number
  pulseIntensity: number
  overrideProbability: number
  overrideIntensity: number
  overrideDurationMin: number
  overrideDurationMax: number
}

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
  /** Bloom swell animation parameters */
  bloomSwell?: BloomSwellParams
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
  /** Contrast adjustment (default 1.0) */
  contrast?: number
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

/** Parameters for CRT scroll corruption effects */
export type CrtScrollCorruptionParams = {
  /** Whether CRT scroll corruption is enabled */
  enabled: boolean
  /** Scroll percentage threshold where corruption starts (0.0-1.0) */
  corruptionThreshold: number
  /** RGB distortion parameters */
  rgbDistortion: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
  }
  /** Block corruption parameters */
  blockCorruption: {
    enabled: boolean
    minRate: number
    maxRate: number
  }
  /** White noise parameters */
  whiteNoise: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
  }
  /** Wave noise parameters */
  waveNoise: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
  }
  /** Static intensity parameters */
  staticIntensity: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
  }
  /** Large block corruption parameters */
  largeBlockCorruption: {
    enabled: boolean
    startThreshold: number
    maxIntensity: number
  }
  /** Artifact noise parameters */
  artifactNoise: {
    enabled: boolean
    startThreshold: number
    maxIntensity: number
    artifactBlockDensity?: number
    artifactHeightJitter?: number
    artifactHeightJitterMin?: number
    artifactHeightJitterMax?: number
  }
}

/** Parameters for selective colorization (grayscale with selective color preservation/remapping) */
export type SelectiveColorizationParams = {
  /** Whether the selective colorization effect is enabled */
  enabled: boolean
  /** Use theme colors instead of custom colors */
  useThemeColors?: boolean
  /** Primary target color (hex string or color object) - defaults to theme primary */
  primaryTargetColor?: string | { r: number; g: number; b: number }
  /** Secondary target color (hex string or color object) - defaults to theme accent */
  secondaryTargetColor?: string | { r: number; g: number; b: number }
  /** Targeting mode configuration */
  targeting: {
    /** Weight for brightness-based targeting (0.0-1.0) */
    brightnessWeight: number
    /** Weight for saturation-based targeting (0.0-1.0) */
    saturationWeight: number
    /** Brightness threshold for colorization (0.0-1.0) */
    brightnessThreshold: number
    /** Saturation threshold for colorization (0.0-1.0) */
    saturationThreshold: number
    /** Smoothness of the blend transition (0.01-0.5) */
    blendSmoothness: number
  }
  /** Color blending configuration */
  colorBlending: {
    /** How to blend between primary and secondary colors: 'brightness' | 'saturation' | 'mixed' */
    blendMode: 'brightness' | 'saturation' | 'mixed'
    /** Blend factor between colors (0.0 = all primary, 1.0 = all secondary) */
    blendBalance: number
  }
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
  /** CRT scroll corruption parameters */
  crtScrollCorruption?: CrtScrollCorruptionParams
  /** Lens flare parameters */
  lensFlare: LensFlareParams
  /** Selective colorization parameters (grayscale with selective color preservation/remapping) */
  selectiveColorization?: SelectiveColorizationParams
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
  /** Whether post-processing is enabled */
  postProcessingEnabled?: boolean
  /** Post-processing configuration */
  postProcessingConfig: PostProcessingConfig
}

declare const configScene: ConfigScene
export default ConfigScene
