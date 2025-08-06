import { ShaderMaterial } from 'three'
import type { RendererState } from '../types.ts'
import { lc, log } from '../../logger/index.ts'
import configPostProcessing from '../configPostProcessing.json' with { type: 'json' }
import { getScrollCorruptionProgress } from '../scene/utils/getScrollCorruptionProgress.ts'
import { getResponsiveScrollSpeed } from '../utils/getResponsiveScrollSpeed.ts'
import { type CorruptionParams, updateCRTShaderUniforms } from '../shaders/CRTShader.ts'
import type { PostProcessingConfig } from '../configPostProcessing.types.ts'
import { scrollState } from '../animation/state/scrollState.ts'

const ppConfig = configPostProcessing as PostProcessingConfig

export const updateScrollCorruption = (scrollY: number, state: RendererState) => {
  if (!state) return

  const crtConfig = ppConfig.crtScrollCorruption

  if (!crtConfig?.enabled) {
    return
  }

  if (state.camera) {
    const currentWidth = globalThis.innerWidth
    const scrollSpeed = getResponsiveScrollSpeed(currentWidth)
    const cameraYOffset = scrollY * scrollSpeed

    state.camera.position.y = cameraYOffset
    const lookAtTarget = cameraYOffset
    state.camera.lookAt(0, lookAtTarget, 0)

    if (state.controls && state.controls.target) {
      state.controls.target.set(0, lookAtTarget, 0)
    }

    state.camera.updateProjectionMatrix()
  }

  const { progress: scrollProgress, intensity: corruptionIntensity } = getScrollCorruptionProgress(scrollY, crtConfig ?? {})

  log.debug(lc.GL, '📊 updateScrollCorruption:', {
    scrollY,
    cameraY: state.camera?.position.y,
    scrollSpeed: getResponsiveScrollSpeed(globalThis.innerWidth),
    screenWidth: globalThis.innerWidth,
    scrollProgress: scrollProgress.toFixed(3),
    corruptionIntensity: corruptionIntensity.toFixed(3),
    documentHeight: document.body.scrollHeight,
    windowHeight: globalThis.innerHeight,
    scrollPercentage: (scrollProgress * 100).toFixed(1) + '%',
  })

  if (state.crtPass && state.crtPass.material) {
    const material = state.crtPass.material as ShaderMaterial
    const corruptionParams: CorruptionParams = {
      enabled: corruptionIntensity > 0.0,
      intensity: corruptionIntensity,
      timeEnabled: true,
      rgbDistortionEnabled: crtConfig.rgbDistortion.enabled,
      rgbDistortionIntensity: crtConfig.rgbDistortion.enabled
        ? crtConfig.rgbDistortion.minIntensity +
          (corruptionIntensity * (crtConfig.rgbDistortion.maxIntensity - crtConfig.rgbDistortion.minIntensity))
        : 0,
      blockCorruptionEnabled: crtConfig.blockCorruption.enabled,
      blockCorruptionRate: crtConfig.blockCorruption.enabled
        ? crtConfig.blockCorruption.minRate +
          (corruptionIntensity * (crtConfig.blockCorruption.maxRate - crtConfig.blockCorruption.minRate))
        : 0,
      whiteNoiseEnabled: crtConfig.whiteNoise.enabled,
      whiteNoiseIntensity: crtConfig.whiteNoise.enabled
        ? crtConfig.whiteNoise.minIntensity +
          (corruptionIntensity * (crtConfig.whiteNoise.maxIntensity - crtConfig.whiteNoise.minIntensity))
        : 0,
      waveNoiseEnabled: crtConfig.waveNoise.enabled,
      waveNoiseIntensity: crtConfig.waveNoise.enabled
        ? crtConfig.waveNoise.minIntensity + (corruptionIntensity * (crtConfig.waveNoise.maxIntensity - crtConfig.waveNoise.minIntensity))
        : 0,
      staticIntensity: crtConfig.staticIntensity.enabled
        ? crtConfig.staticIntensity.minIntensity +
          (corruptionIntensity * (crtConfig.staticIntensity.maxIntensity - crtConfig.staticIntensity.minIntensity))
        : 0,
      largeBlockEnabled: crtConfig.largeBlockCorruption.enabled && corruptionIntensity > crtConfig.largeBlockCorruption.startThreshold,
      largeBlockIntensity: crtConfig.largeBlockCorruption.enabled && corruptionIntensity > crtConfig.largeBlockCorruption.startThreshold
        ? ((corruptionIntensity - crtConfig.largeBlockCorruption.startThreshold) / (1.0 - crtConfig.largeBlockCorruption.startThreshold)) *
          crtConfig.largeBlockCorruption.maxIntensity
        : 0,
      artifactNoiseEnabled: crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold,
      artifactNoiseIntensity: crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold
        ? ((corruptionIntensity - crtConfig.artifactNoise.startThreshold) / (1.0 - crtConfig.artifactNoise.startThreshold)) *
          crtConfig.artifactNoise.maxIntensity
        : 0,
      artifactBlockDensity: crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold
        ? ((corruptionIntensity - crtConfig.artifactNoise.startThreshold) / (1.0 - crtConfig.artifactNoise.startThreshold)) *
          (crtConfig.artifactNoise.artifactBlockDensity ?? 0.7)
        : 0,
      artifactHeightJitter: crtConfig.artifactNoise.artifactHeightJitter,
      artifactHeightJitterMin: crtConfig.artifactNoise.artifactHeightJitterMin,
      artifactHeightJitterMax: crtConfig.artifactNoise.artifactHeightJitterMax,
      artifactNoiseFPS: crtConfig.artifactNoise.artifactNoiseFPS,
      shakeEnabled: false,
    }
    updateCRTShaderUniforms(material, corruptionParams)
  }

  if (state.pixelBleedPass && state.pixelBleedPass.material) {
    const material = state.pixelBleedPass.material as ShaderMaterial
    if (material.uniforms && state.pixelBleedPass.enabled) {
      material.uniforms.time.value = performance.now() / 1000
    }
  }

  if (state.pixelationPass) {
    const basePixelSize = 16
    const maxPixelSize = 64
    const pixelSize = basePixelSize + (corruptionIntensity * (maxPixelSize - basePixelSize))
    if (state.pixelationPass.uniforms.pixelSize) state.pixelationPass.uniforms.pixelSize.value = pixelSize
  }

  if (state.finalPass?.uniforms) {
    const baseChroma = 0.002
    const maxChroma = 0.02
    const chromaStrength = baseChroma + (corruptionIntensity * (maxChroma - baseChroma))
    state.finalPass.uniforms.chromaStrength.value = chromaStrength
  }
}

export const updateScrollMetrics = (scrollVelocity: number, glState: RendererState | null) => {
  if (!glState) return

  // Use scroll velocity from shared state if not provided
  const velocity = scrollVelocity || scrollState.velocity

  if (glState.ditheringPass?.uniforms) {
    const baseIntensity = 0.8
    const velocityMultiplier = Math.min(Math.abs(velocity) * 0.0001, 2.0) // Adjusted for pixels/second
    glState.ditheringPass.uniforms.intensity.value = baseIntensity + velocityMultiplier
  }
}
