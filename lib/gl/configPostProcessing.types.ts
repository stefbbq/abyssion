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
  /** Whether film pass is enabled (optional; defaults to true if provided) */
  enabled?: boolean
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
  /** Whether the final pass is enabled */
  enabled: boolean
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
  /** Vignette parameters */
  vignette?: {
    /** Whether vignette is enabled (default true) */
    enabled?: boolean
    /** Radius where vignette starts [0..1] */
    start: number
    /** Radius where vignette ends/darkens fully [0..1] */
    end: number
    /** Max darkness applied at the edges [0..1] */
    darkness: number
    /** Desaturation applied at the edges [0..1] */
    desaturation: number
  }
}

/** Parameters for sharpening effect */
export type SharpeningParams = {
  /** Sharpening strength */
  strength: number
  /** Whether sharpening is enabled */
  enabled: boolean
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
    /** Update frequency for rgb distortion (FPS). Use 0 for continuous */
    fps?: number
    /** Large scale wave multiplier for Y (default 0.01) */
    waveLargeScale?: number
    /** Fine scale wave multiplier for Y (default 0.02) */
    waveFineScale?: number
    /** Line wave frequency 1 (default 1.6) */
    lineFrequency1?: number
    /** Line wave frequency 2 (default 2.0) */
    lineFrequency2?: number
    /** Shape mode: 'sine' | 'triangle' | 'block' (default 'sine') */
    shapeMode?: 'sine' | 'triangle' | 'block'
    /** Overall separation amplitude scale (default 1.0) */
    separationScale?: number
    /** Wave displacement amplitude multiplier (default 1.0) */
    waveAmplitude?: number
    /** Threshold for line 1 spikes (0.0-1.0, default 0.999) */
    lineThreshold1?: number
    /** Threshold for line 2 spikes (0.0-1.0, default 0.9995) */
    lineThreshold2?: number
  }
  /** Block corruption parameters */
  blockCorruption: {
    enabled: boolean
    minRate: number
    maxRate: number
    /** Update frequency for block corruption state changes (FPS). Use 0 for continuous */
    fps?: number
  }
  /** White noise parameters */
  whiteNoise: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
    /** Update frequency for white noise (FPS). Use 0 for continuous */
    fps?: number
  }
  /** Wave noise parameters */
  waveNoise: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
    /** Update frequency for wave noise (FPS). Use 0 for continuous */
    fps?: number
  }
  /** Static intensity parameters */
  staticIntensity: {
    enabled: boolean
    minIntensity: number
    maxIntensity: number
    /** Update frequency for static pattern generation (FPS). Use 0 for continuous */
    fps?: number
  }
  /** Large block corruption parameters */
  largeBlockCorruption: {
    enabled: boolean
    startThreshold: number
    maxIntensity: number
    /** Update frequency for large block corruption (FPS). */
    fps?: number
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
    artifactNoiseFPS?: number
    /** Update frequency for artifact noise (FPS). Alias for artifactNoiseFPS. */
    fps?: number
    /** Use theme colors to tint artifact noise */
    useThemeColors?: boolean
  }
  /** Debug overlay for visualizing per-effect FPS and stepping */
  debugOverlay?: {
    enabled: boolean
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
  /** Whether post-processing is enabled */
  enabled?: boolean
  /** Bokeh/depth of field parameters */
  bokeh?: BokehParams
  /** Bloom effect parameters */
  bloom?: BloomParams
  /** Film grain parameters */
  film?: FilmParams
  /** Final pass parameters */
  finalPass?: FinalPassParams
  /** Sharpening parameters */
  sharpening?: SharpeningParams
  /** Pixelation parameters */
  pixelate?: PixelateParams
  /** CRT scroll corruption parameters */
  crtScrollCorruption?: CrtScrollCorruptionParams
  /** Selective colorization parameters (grayscale with selective color preservation/remapping) */
  selectiveColorization?: SelectiveColorizationParams
}

declare const configPostProcessing: PostProcessingConfig
export default configPostProcessing
