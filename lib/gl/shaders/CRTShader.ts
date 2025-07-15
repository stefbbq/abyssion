import { ShaderMaterial } from 'three'
import crtFragmentShader from './glsl/crt.frag.ts'
import passthroughVertexShader from './glsl/passthrough.vert.ts'
import pixelBleedFragmentShader from './glsl/pixelBleed.frag.ts'

/**
 * CRT Corruption Shader
 * Creates various corruption effects like RGB distortion, block corruption,
 * white noise, wave distortion, and screen shake
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

    // White noise controls - DISABLED BY DEFAULT
    whiteNoiseIntensity: { value: 0.0 },
    whiteNoiseEnabled: { value: 0.0 },

    // Block corruption controls - DISABLED BY DEFAULT
    blockCorruptionRate: { value: 0.0 },
    blockCorruptionEnabled: { value: 0.0 },

    // Wave distortion controls - DISABLED BY DEFAULT
    waveNoiseIntensity: { value: 0.0 },
    waveNoiseEnabled: { value: 0.0 },

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

    // Pixel bleed controls (for future use) - DISABLED BY DEFAULT
    pixelBleedIntensity: { value: 0.0 },
    pixelBleedChunkSize: { value: 20.0 },
    pixelBleedChunkRandomness: { value: 0.5 },
    pixelBleedStretchDistance: { value: 0.3 },
    pixelBleedGeometryComplexity: { value: 0.5 },
    pixelBleedPersistence: { value: 0.5 },
    pixelBleedRegenerationRate: { value: 0.5 },
  },

  vertexShader: passthroughVertexShader,
  fragmentShader: crtFragmentShader,
}

/**
 * Pixel Bleed Shader
 * Creates geometric pixel stretching corruption effects
 */
export const PixelBleedShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: null },
    time: { value: 0.0 },
    intensity: { value: 0.0 },
    chunkSize: { value: 20.0 },
    chunkRandomness: { value: 0.5 },
    stretchDistance: { value: 0.3 },
    geometryComplexity: { value: 0.5 },
    persistence: { value: 0.5 },
    regenerationRate: { value: 0.5 },
  },

  vertexShader: passthroughVertexShader,
  fragmentShader: pixelBleedFragmentShader,
}

/**
 * Update CRT shader uniforms from corruption parameters
 */
export const updateCRTShaderUniforms = (material: ShaderMaterial, params: any) => {
  // Base parameters
  if (material.uniforms.corruptionIntensity) {
    material.uniforms.corruptionIntensity.value = params.enabled ? params.intensity : 0.0
  }

  if (material.uniforms.time) {
    material.uniforms.time.value = params.timeEnabled ? performance.now() / 1000 : 0.0
  }

  // Static intensity
  if (material.uniforms.staticIntensity) {
    material.uniforms.staticIntensity.value = params.staticIntensity ?? 0.0
  }

  // RGB distortion
  if (material.uniforms.rgbDistortionEnabled) {
    material.uniforms.rgbDistortionEnabled.value = params.rgbDistortionEnabled ? 1.0 : 0.0
  }
  if (material.uniforms.rgbDistortionIntensity) {
    material.uniforms.rgbDistortionIntensity.value = params.rgbDistortionIntensity ?? 0.0
  }

  // White noise
  if (material.uniforms.whiteNoiseEnabled) {
    material.uniforms.whiteNoiseEnabled.value = params.whiteNoiseEnabled ? 1.0 : 0.0
  }
  if (material.uniforms.whiteNoiseIntensity) {
    material.uniforms.whiteNoiseIntensity.value = params.whiteNoiseIntensity ?? 0.0
  }

  // Block corruption
  if (material.uniforms.blockCorruptionEnabled) {
    material.uniforms.blockCorruptionEnabled.value = params.blockCorruptionEnabled ? 1.0 : 0.0
  }
  if (material.uniforms.blockCorruptionRate) {
    material.uniforms.blockCorruptionRate.value = params.blockCorruptionRate ?? 0.0
  }

  // Wave noise
  if (material.uniforms.waveNoiseEnabled) {
    material.uniforms.waveNoiseEnabled.value = params.waveNoiseEnabled ? 1.0 : 0.0
  }
  if (material.uniforms.waveNoiseIntensity) {
    material.uniforms.waveNoiseIntensity.value = params.waveNoiseIntensity ?? 0.0
  }

  // Screen shake
  if (material.uniforms.shakeEnabled) {
    material.uniforms.shakeEnabled.value = params.shakeEnabled ? 1.0 : 0.0
  }
  if (material.uniforms.shakeIntensity) {
    material.uniforms.shakeIntensity.value = params.shakeIntensity ?? 0.0
  }

  // Large block corruption
  if (material.uniforms.largeBlockIntensity) {
    material.uniforms.largeBlockIntensity.value = params.largeBlockEnabled ? (params.largeBlockIntensity ?? 0.0) : 0.0
  }
  if (material.uniforms.largeBlockSize) {
    material.uniforms.largeBlockSize.value = params.largeBlockSize ?? 20.0
  }
  if (material.uniforms.largeBlockFPS) {
    material.uniforms.largeBlockFPS.value = params.largeBlockFPS ?? 10.0
  }

  // Artifact noise
  if (material.uniforms.artifactNoiseIntensity) {
    material.uniforms.artifactNoiseIntensity.value = params.artifactNoiseEnabled ? (params.artifactNoiseIntensity ?? 0.0) : 0.0
  }
  if (material.uniforms.artifactChunkSize) {
    material.uniforms.artifactChunkSize.value = params.artifactChunkSize ?? 50.0
  }
  if (material.uniforms.artifactShiftAmount) {
    material.uniforms.artifactShiftAmount.value = params.artifactShiftAmount ?? 0.5
  }
  if (material.uniforms.artifactNoiseFPS) {
    material.uniforms.artifactNoiseFPS.value = params.artifactNoiseFPS ?? 10.0
  }

  // Pixel bleed controls
  if (material.uniforms.pixelBleedIntensity) {
    material.uniforms.pixelBleedIntensity.value = params.pixelBleedEnabled ? (params.pixelBleedIntensity ?? 0.0) : 0.0
  }
  if (material.uniforms.pixelBleedChunkSize) {
    material.uniforms.pixelBleedChunkSize.value = params.pixelBleedChunkSize ?? 20.0
  }
  if (material.uniforms.pixelBleedChunkRandomness) {
    material.uniforms.pixelBleedChunkRandomness.value = params.pixelBleedChunkRandomness ?? 0.5
  }
  if (material.uniforms.pixelBleedStretchDistance) {
    material.uniforms.pixelBleedStretchDistance.value = params.pixelBleedStretchDistance ?? 0.3
  }
  if (material.uniforms.pixelBleedGeometryComplexity) {
    material.uniforms.pixelBleedGeometryComplexity.value = params.pixelBleedGeometryComplexity ?? 0.5
  }
  if (material.uniforms.pixelBleedPersistence) {
    material.uniforms.pixelBleedPersistence.value = params.pixelBleedPersistence ?? 0.5
  }
  if (material.uniforms.pixelBleedRegenerationRate) {
    material.uniforms.pixelBleedRegenerationRate.value = params.pixelBleedRegenerationRate ?? 0.5
  }
}

/**
 * Update pixel bleed shader uniforms from corruption parameters
 */
export const updatePixelBleedShaderUniforms = (material: ShaderMaterial, params: any) => {
  if (material.uniforms.intensity) {
    material.uniforms.intensity.value = params.pixelBleedEnabled ? (params.pixelBleedIntensity ?? 0.0) : 0.0
  }

  if (material.uniforms.time) {
    // Always update time when enabled and timeEnabled is true
    material.uniforms.time.value = (params.pixelBleedEnabled && params.timeEnabled) ? performance.now() / 1000 : 0.0
  }

  if (material.uniforms.chunkSize) {
    material.uniforms.chunkSize.value = params.pixelBleedChunkSize ?? 20.0
  }

  if (material.uniforms.chunkRandomness) {
    material.uniforms.chunkRandomness.value = params.pixelBleedChunkRandomness ?? 0.5
  }

  if (material.uniforms.stretchDistance) {
    material.uniforms.stretchDistance.value = params.pixelBleedStretchDistance ?? 0.3
  }

  if (material.uniforms.geometryComplexity) {
    material.uniforms.geometryComplexity.value = params.pixelBleedGeometryComplexity ?? 0.5
  }

  if (material.uniforms.persistence) {
    material.uniforms.persistence.value = params.pixelBleedPersistence ?? 0.5
  }

  if (material.uniforms.regenerationRate) {
    material.uniforms.regenerationRate.value = params.pixelBleedRegenerationRate ?? 0.5
  }
}
