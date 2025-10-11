export type DOFParams = {
  focus: number
  aperture: number
  maxblur: number
  /** live focus distance being used by the animation loop */
  liveFocusDistance: number
}

export type FinalPassParams = {
  chromaStrength: number
  gain: number
  contrast: number
}

export type SelectiveColorizationParams = {
  enabled: boolean
  useThemeColors: boolean
  primaryTargetColor: string
  secondaryTargetColor: string
  targeting: {
    brightnessWeight: number
    saturationWeight: number
    brightnessThreshold: number
    saturationThreshold: number
    blendSmoothness: number
  }
  colorBlending: {
    blendMode: 'mixed' | 'overlay' | 'multiply'
    blendBalance: number
  }
}

export type CorruptionParams = {
  enabled: boolean
  intensity: number
  timeEnabled: boolean

  // Existing effect parameters
  staticIntensity: number

  // RGB distortion parameters
  rgbDistortionIntensity: number
  rgbDistortionEnabled: boolean

  // White noise parameters
  whiteNoiseIntensity: number
  whiteNoiseEnabled: boolean

  // Original block corruption parameters
  blockCorruptionRate: number
  blockCorruptionEnabled: boolean

  // Wave distortion parameters
  waveNoiseIntensity: number
  waveNoiseEnabled: boolean

  // Screen shake parameters
  shakeIntensity: number
  shakeEnabled: boolean

  // Advanced pixel bleed effect parameters
  pixelBleedIntensity: number
  pixelBleedChunkSize: number
  pixelBleedChunkRandomness: number
  pixelBleedStretchDistance: number
  pixelBleedGeometryComplexity: number
  pixelBleedPersistence: number
  pixelBleedRegenerationRate: number
  pixelBleedEnabled: boolean

  // Large block corruption parameters
  largeBlockIntensity: number
  largeBlockSize: number
  largeBlockFPS: number
  largeBlockEnabled: boolean

  // Artifact noise parameters
  artifactNoiseIntensity: number
  artifactChunkSize: number
  artifactShiftAmount: number
  artifactNoiseFPS: number
  artifactNoiseEnabled: boolean
}
