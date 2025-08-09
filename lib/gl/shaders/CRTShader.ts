/**
 * CRT Corruption Shader System
 *
 * This shader system creates authentic CRT television corruption effects including:
 * - RGB channel distortion (chromatic aberration)
 * - Block corruption (digital artifacts)
 * - White noise (analog static)
 * - Wave distortion (scan line effects)
 * - Screen shake (mechanical vibration)
 * - Large block corruption (major signal loss)
 * - Artifact noise (horizontal strips with pixel shifting)
 *
 * The system is designed to simulate the visual artifacts of failing CRT monitors
 * and analog television signals, creating authentic retro corruption effects.
 *
 * @example
 * ```typescript
 * import { CRTShader, updateCRTShaderUniforms } from './CRTShader.ts'
 *
 * // Create shader material
 * const material = new THREE.ShaderMaterial(CRTShader)
 *
 * // Configure corruption effects
 * const params: CorruptionParams = {
 *   enabled: true,
 *   intensity: 0.5,
 *   timeEnabled: true,
 *   rgbDistortionEnabled: true,
 *   rgbDistortionIntensity: 10.0,
 *   whiteNoiseEnabled: true,
 *   whiteNoiseIntensity: 0.1
 * }
 *
 * // Update shader uniforms
 * updateCRTShaderUniforms(material, params)
 * ```
 */

import { ShaderMaterial } from 'three'
import crtFragmentShader from './glsl/crt.frag.ts'
import passthroughVertexShader from './glsl/passthrough.vert.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * CRT corruption parameters for shader uniforms
 *
 * This interface defines all available corruption effects and their intensities.
 * Each effect can be individually enabled/disabled and configured.
 */
export type CorruptionParams = {
  // Base parameters
  // Master enable/disable switch for all corruption effects
  enabled: boolean
  // Overall corruption intensity multiplier (0.0 to 1.0)
  intensity: number
  // Enable time-based animation for dynamic effects
  timeEnabled: boolean

  // Static Effects
  // Base static intensity for general noise (0.0 to 2.0)
  staticIntensity?: number

  // RGB Distortion Effects
  // Enable RGB channel separation (chromatic aberration)
  rgbDistortionEnabled: boolean
  // Intensity of RGB channel offset (0.0 to 50.0)
  rgbDistortionIntensity?: number
  // Update frequency for RGB distortion animation (FPS). 0 = continuous
  rgbDistortionFPS?: number
  // Large scale wave multiplier for Y
  rgbWaveLargeScale?: number
  // Fine scale wave multiplier for Y
  rgbWaveFineScale?: number
  // Line wave frequencies
  rgbLineFrequency1?: number
  rgbLineFrequency2?: number
  // Shape mode selector (0=sine,1=triangle,2=block)
  rgbShapeMode?: number
  // Separation amplitude scale
  rgbSeparationScale?: number

  // White Noise Effects
  // Enable random white noise overlay
  whiteNoiseEnabled: boolean
  // Intensity of white noise static (0.0 to 2.0)
  whiteNoiseIntensity?: number
  // Update frequency for white noise animation (FPS). 0 = continuous
  whiteNoiseFPS?: number

  // Block Corruption Effects
  // Enable rectangular block corruption artifacts
  blockCorruptionEnabled: boolean
  // Speed of block corruption updates (1.0 to 50.0)
  blockCorruptionRate?: number

  // Wave Distortion Effects
  // Enable wave-based distortion
  waveNoiseEnabled: boolean
  // Intensity of wave distortion (0.0 to 2.0)
  waveNoiseIntensity?: number
  // Update frequency for wave distortion (FPS). 0 = continuous
  waveNoiseFPS?: number

  // Screen Shake Effects
  // Enable screen shake/vibration
  shakeEnabled: boolean
  // Intensity of screen shake (0.0 to 50.0)
  shakeIntensity?: number

  // Large Block Corruption Effects
  // Enable large irregular block corruption
  largeBlockEnabled: boolean
  // Intensity of large block corruption (0.0 to 1.0)
  largeBlockIntensity?: number
  // Size of large corruption blocks (1.0 to 50.0)
  largeBlockSize?: number
  // Update frequency for large blocks (1.0 to 30.0 FPS)
  largeBlockFPS?: number

  // Artifact Noise Effects
  // Enable horizontal artifact noise strips
  artifactNoiseEnabled: boolean
  // Intensity of artifact noise (0.0 to 1.0)
  artifactNoiseIntensity?: number
  // Size of artifact chunks (1.0 to 100.0)
  artifactChunkSize?: number
  // Amount of horizontal shifting (0.0 to 1.0)
  artifactShiftAmount?: number
  // Update frequency for artifact noise (1.0 to 30.0 FPS)
  artifactNoiseFPS?: number
  // Probability that a strip becomes an artifact (0.0 to 1.0)
  artifactBlockDensity?: number
  // Height variation of artifact blocks (0.0 to 1.0)
  artifactHeightJitter?: number
  // Minimum height jitter multiplier
  artifactHeightJitterMin?: number
  // Maximum height jitter multiplier
  artifactHeightJitterMax?: number
}

/**
 * CRT Corruption Shader
 *
 * A comprehensive shader for creating authentic CRT television corruption effects.
 * This shader simulates the visual artifacts of failing CRT monitors and analog
 * television signals, including various types of distortion, noise, and corruption.
 *
 * Features:
 * - RGB Channel Distortion: Simulates chromatic aberration and color channel separation
 * - Block Corruption: Creates digital compression-like artifacts with rectangular blocks
 * - White Noise: Adds analog static noise overlay
 * - Wave Distortion: Simulates scan line and wave-based distortion
 * - Screen Shake: Adds mechanical vibration effects
 * - Large Block Corruption: Creates major signal loss with irregular blocks
 * - Artifact Noise: Horizontal strips with pixel shifting, strongest at screen edges
 *
 * All effects are disabled by default and can be individually enabled and configured.
 * The shader uses time-based animation for dynamic effects when timeEnabled is true.
 *
 * @performance The shader is optimized to skip disabled effects, minimizing GPU load.
 * @compatibility Works with Three.js post-processing pipeline via ShaderPass.
 */
export const CRTShader = {
  uniforms: {
    // Base uniforms
    tDiffuse: { value: null },
    resolution: { value: null },
    corruptionIntensity: { value: 0.0 },
    time: { value: 0.0 },

    // Existing effect uniforms - ALL DISABLED BY DEFAULT
    staticIntensity: { value: 0.0 },

    // RGB distortion controls - DISABLED BY DEFAULT
    rgbDistortionIntensity: { value: 0.0 },
    rgbDistortionEnabled: { value: 0.0 },
    rgbDistortionFPS: { value: 0.0 },
    rgbWaveLargeScale: { value: 0.01 },
    rgbWaveFineScale: { value: 0.02 },
    rgbLineFrequency1: { value: 1.6 },
    rgbLineFrequency2: { value: 2.0 },
    rgbShapeMode: { value: 0.0 },
    rgbSeparationScale: { value: 1.0 },
    rgbWaveAmplitude: { value: 1.0 },
    rgbLineThreshold1: { value: 0.999 },
    rgbLineThreshold2: { value: 0.9995 },

    // White noise controls - DISABLED BY DEFAULT
    whiteNoiseIntensity: { value: 0.0 },
    whiteNoiseEnabled: { value: 0.0 },
    whiteNoiseFPS: { value: 0.0 },

    // Block corruption controls - DISABLED BY DEFAULT
    blockCorruptionRate: { value: 0.0 },
    blockCorruptionEnabled: { value: 0.0 },

    // Wave distortion controls - DISABLED BY DEFAULT
    waveNoiseIntensity: { value: 0.0 },
    waveNoiseEnabled: { value: 0.0 },
    waveNoiseFPS: { value: 0.0 },

    // Screen shake controls - DISABLED BY DEFAULT
    shakeIntensity: { value: 0.0 },
    shakeEnabled: { value: 0.0 },

    // Large block corruption controls - DISABLED BY DEFAULT
    largeBlockIntensity: { value: 0.0 },
    largeBlockSize: { value: 20.0 },
    largeBlockFPS: { value: 10.0 },

    // Artifact noise controls - DISABLED BY DEFAULT
    artifactNoiseIntensity: { value: 0.0 },
    artifactChunkSize: { value: 50.0 },
    artifactShiftAmount: { value: 0.5 },
    artifactNoiseFPS: { value: 10.0 },
    artifactBlockDensity: { value: 0.7 }, // probability a strip is an artifact
    artifactHeightJitter: { value: 0.5 }, // how much the height of each block can vary
    artifactHeightJitterMin: { value: 0.3 }, // min jitter multiplier
    artifactHeightJitterMax: { value: 1.7 }, // max jitter multiplier

    // Debug overlay toggle
    debugOverlayEnabled: { value: 0.0 },

    // Theme colors for artifact tinting
    artifactUseTheme: { value: 0.0 },
    themePrimary: { value: [1, 1, 1] },
    themeAccent: { value: [1, 1, 1] },
    themeSecondary: { value: [1, 1, 1] },
  },

  vertexShader: passthroughVertexShader,
  fragmentShader: crtFragmentShader,
}

/**
 * Update CRT shader uniforms from corruption parameters
 *
 * This function efficiently updates all CRT shader uniforms based on the provided
 * corruption parameters. It handles the translation between high-level parameters
 * and low-level shader uniforms, including proper enable/disable logic.
 *
 * The function is optimized to only update uniforms that exist in the material,
 * making it safe to use with different shader variations.
 *
 * @param material - The Three.js ShaderMaterial with CRT shader uniforms
 * @param params - Corruption parameters defining effect intensities and enables
 *
 * @example
 * ```typescript
 * // Update shader with specific corruption effects
 * updateCRTShaderUniforms(crtMaterial, {
 *   enabled: true,
 *   intensity: 0.8,
 *   timeEnabled: true,
 *   rgbDistortionEnabled: true,
 *   rgbDistortionIntensity: 15.0,
 *   largeBlockEnabled: true,
 *   largeBlockIntensity: 0.6
 * })
 * ```
 *
 * @performance The function includes null checks for all uniforms to avoid errors
 *              and uses conditional logic to disable unused effects.
 */
export const updateCRTShaderUniforms = (material: ShaderMaterial, params: CorruptionParams) => {
  if (!material.uniforms) {
    log.error(lc.GL, 'CRTShader uniforms are not set')
    return
  }

  const { uniforms } = material
  const {
    enabled,
    intensity,
    timeEnabled,
    staticIntensity,
    rgbDistortionEnabled,
    rgbDistortionIntensity,
    whiteNoiseEnabled,
    whiteNoiseIntensity,
    whiteNoiseFPS,
    blockCorruptionEnabled,
    blockCorruptionRate,
    waveNoiseEnabled,
    waveNoiseIntensity,
    waveNoiseFPS,
    shakeEnabled,
    shakeIntensity,
    largeBlockEnabled,
    largeBlockIntensity,
    largeBlockSize,
    largeBlockFPS,
    rgbDistortionFPS,
    rgbWaveLargeScale,
    rgbWaveFineScale,
    rgbLineFrequency1,
    rgbLineFrequency2,
    rgbShapeMode,
    rgbSeparationScale,
    artifactNoiseEnabled,
    artifactNoiseIntensity,
    artifactChunkSize,
    artifactShiftAmount,
    artifactNoiseFPS,
    artifactBlockDensity,
    artifactHeightJitter,
    artifactHeightJitterMin,
    artifactHeightJitterMax,
  } = params

  // Base parameters
  if (uniforms.corruptionIntensity) uniforms.corruptionIntensity.value = enabled ? intensity : 0.0
  if (uniforms.time) uniforms.time.value = timeEnabled ? performance.now() / 1000 : 0.0

  // Static intensity
  if (uniforms.staticIntensity) uniforms.staticIntensity.value = staticIntensity ?? 0.0

  // RGB distortion
  if (uniforms.rgbDistortionEnabled) uniforms.rgbDistortionEnabled.value = rgbDistortionEnabled ? 1.0 : 0.0
  if (uniforms.rgbDistortionIntensity) uniforms.rgbDistortionIntensity.value = rgbDistortionIntensity ?? 0.0
  if (uniforms.rgbDistortionFPS) uniforms.rgbDistortionFPS.value = rgbDistortionFPS ?? 0.0
  if (uniforms.rgbWaveLargeScale) uniforms.rgbWaveLargeScale.value = rgbWaveLargeScale ?? 0.01
  if (uniforms.rgbWaveFineScale) uniforms.rgbWaveFineScale.value = rgbWaveFineScale ?? 0.02
  if (uniforms.rgbLineFrequency1) uniforms.rgbLineFrequency1.value = rgbLineFrequency1 ?? 1.6
  if (uniforms.rgbLineFrequency2) uniforms.rgbLineFrequency2.value = rgbLineFrequency2 ?? 2.0
  if (uniforms.rgbShapeMode) uniforms.rgbShapeMode.value = rgbShapeMode ?? 0.0
  if (uniforms.rgbSeparationScale) uniforms.rgbSeparationScale.value = rgbSeparationScale ?? 1.0

  // White noise
  if (uniforms.whiteNoiseEnabled) uniforms.whiteNoiseEnabled.value = whiteNoiseEnabled ? 1.0 : 0.0
  if (uniforms.whiteNoiseIntensity) uniforms.whiteNoiseIntensity.value = whiteNoiseIntensity ?? 0.0
  if (uniforms.whiteNoiseFPS) uniforms.whiteNoiseFPS.value = whiteNoiseFPS ?? 0.0

  // Block corruption
  if (uniforms.blockCorruptionEnabled) uniforms.blockCorruptionEnabled.value = blockCorruptionEnabled ? 1.0 : 0.0
  if (uniforms.blockCorruptionRate) uniforms.blockCorruptionRate.value = blockCorruptionRate ?? 0.0

  // Wave noise
  if (uniforms.waveNoiseEnabled) uniforms.waveNoiseEnabled.value = waveNoiseEnabled ? 1.0 : 0.0
  if (uniforms.waveNoiseIntensity) uniforms.waveNoiseIntensity.value = waveNoiseIntensity ?? 0.0
  if (uniforms.waveNoiseFPS) uniforms.waveNoiseFPS.value = waveNoiseFPS ?? 0.0

  // Screen shake
  if (uniforms.shakeEnabled) uniforms.shakeEnabled.value = shakeEnabled ? 1.0 : 0.0
  if (uniforms.shakeIntensity) uniforms.shakeIntensity.value = shakeIntensity ?? 0.0

  // Large block corruption
  if (uniforms.largeBlockIntensity) uniforms.largeBlockIntensity.value = largeBlockEnabled ? (largeBlockIntensity ?? 0.0) : 0.0
  if (uniforms.largeBlockSize) uniforms.largeBlockSize.value = largeBlockSize ?? 20.0
  if (uniforms.largeBlockFPS) uniforms.largeBlockFPS.value = largeBlockFPS ?? 10.0

  // Artifact noise
  if (uniforms.artifactNoiseIntensity) uniforms.artifactNoiseIntensity.value = artifactNoiseEnabled ? (artifactNoiseIntensity ?? 0.0) : 0.0
  if (uniforms.artifactChunkSize) uniforms.artifactChunkSize.value = artifactChunkSize ?? 50.0
  if (uniforms.artifactShiftAmount) uniforms.artifactShiftAmount.value = artifactShiftAmount ?? 0.5
  if (uniforms.artifactNoiseFPS) uniforms.artifactNoiseFPS.value = artifactNoiseFPS ?? 10.0
  if (uniforms.artifactBlockDensity) uniforms.artifactBlockDensity.value = artifactBlockDensity ?? 0.7
  if (uniforms.artifactHeightJitter) uniforms.artifactHeightJitter.value = artifactHeightJitter ?? 0.5
  if (uniforms.artifactHeightJitterMin) uniforms.artifactHeightJitterMin.value = artifactHeightJitterMin ?? 0.3
  if (uniforms.artifactHeightJitterMax) uniforms.artifactHeightJitterMax.value = artifactHeightJitterMax ?? 1.7
}
