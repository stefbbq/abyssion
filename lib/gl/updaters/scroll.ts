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

/**
 * updates camera position and post-processing shader uniforms based on scroll position
 */
export const updateScrollCorruption = (scrollY: number, state: RendererState) => {
  // check if state is provided; no state means no update
  if (!state) {
    log.error(lc.GL, 'updateScrollCorruption: No state provided')
    return
  }

  // get the CRT scroll corruption config
  const crtConfig = ppConfig.crtScrollCorruption

  // if the CRT scroll corruption is disabled, return
  if (!crtConfig?.enabled) {
    log.debug(lc.GL, 'updateScrollCorruption: CRT scroll corruption is disabled')
    return
  }

  // update the camera position and lookAt target based on scrollY
  if (state.camera) {
    const currentWidth = globalThis.innerWidth
    const currentHeight = globalThis.innerHeight
    const scrollSpeed = getResponsiveScrollSpeed(currentWidth, currentHeight)
    const cameraYOffset = scrollY * scrollSpeed

    state.camera.position.y = cameraYOffset
    const lookAtTarget = cameraYOffset
    state.camera.lookAt(0, lookAtTarget, 0)

    if (state.controls?.target) state.controls.target.set(0, lookAtTarget, 0)

    state.camera.updateProjectionMatrix()
  }

  // get scroll corruption progress and intensity
  const { progress: scrollProgress, intensity: corruptionIntensity } = getScrollCorruptionProgress(scrollY, crtConfig ?? {})

  // log the scroll corruption progress and intensity
  log.trace(lc.GL, '📊 updateScrollCorruption:', {
    scrollY,
    cameraY: state.camera?.position.y,
    scrollSpeed: getResponsiveScrollSpeed(globalThis.innerWidth, globalThis.innerHeight),
    screenWidth: globalThis.innerWidth,
    scrollProgress: scrollProgress.toFixed(3),
    corruptionIntensity: corruptionIntensity.toFixed(3),
    documentHeight: document.body.scrollHeight,
    windowHeight: globalThis.innerHeight,
    scrollPercentage: (scrollProgress * 100).toFixed(1) + '%',
  })

  // update the CRT shader uniforms if the material is available
  if (state.crtPass?.material) {
    const material = state.crtPass.material as ShaderMaterial

    // compute readable, intermediate values instead of ternaries
    const rgbDistortionEnabled = crtConfig.rgbDistortion.enabled
    let rgbDistortionIntensity = 0
    if (rgbDistortionEnabled) {
      const { minIntensity, maxIntensity } = crtConfig.rgbDistortion
      rgbDistortionIntensity = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
    }

    const blockCorruptionEnabled = crtConfig.blockCorruption.enabled
    let blockCorruptionRate = 0
    if (blockCorruptionEnabled) {
      const { minRate, maxRate } = crtConfig.blockCorruption
      blockCorruptionRate = minRate + (corruptionIntensity * (maxRate - minRate))
    }

    const whiteNoiseEnabled = crtConfig.whiteNoise.enabled
    let whiteNoiseIntensity = 0
    if (whiteNoiseEnabled) {
      const { minIntensity, maxIntensity } = crtConfig.whiteNoise
      whiteNoiseIntensity = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
    }

    const waveNoiseEnabled = crtConfig.waveNoise.enabled
    let waveNoiseIntensity = 0
    if (waveNoiseEnabled) {
      const { minIntensity, maxIntensity } = crtConfig.waveNoise
      waveNoiseIntensity = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
    }

    let staticIntensity = 0
    if (crtConfig.staticIntensity.enabled) {
      const { minIntensity, maxIntensity } = crtConfig.staticIntensity
      staticIntensity = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
    }

    const largeBlockEnabled = crtConfig.largeBlockCorruption.enabled && corruptionIntensity > crtConfig.largeBlockCorruption.startThreshold
    let largeBlockIntensity = 0
    if (largeBlockEnabled) {
      const { startThreshold, maxIntensity } = crtConfig.largeBlockCorruption
      const t = (corruptionIntensity - startThreshold) / (1.0 - startThreshold)
      largeBlockIntensity = t * maxIntensity
    }

    const artifactNoiseEnabled = crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold
    let artifactNoiseIntensity = 0
    let artifactBlockDensity = 0
    if (artifactNoiseEnabled) {
      const { startThreshold, maxIntensity, artifactBlockDensity: defaultDensity } = crtConfig.artifactNoise
      const t = (corruptionIntensity - startThreshold) / (1.0 - startThreshold)
      artifactNoiseIntensity = t * maxIntensity
      const density = defaultDensity ?? 0.7
      artifactBlockDensity = t * density
    }

    // update the CRT shader uniforms
    const corruptionParams: CorruptionParams = {
      enabled: corruptionIntensity > 0.0,
      intensity: corruptionIntensity,
      timeEnabled: true,
      rgbDistortionEnabled,
      rgbDistortionIntensity,
      blockCorruptionEnabled,
      blockCorruptionRate,
      whiteNoiseEnabled,
      whiteNoiseIntensity,
      waveNoiseEnabled,
      waveNoiseIntensity,
      staticIntensity,
      largeBlockEnabled,
      largeBlockIntensity,
      artifactNoiseEnabled,
      artifactNoiseIntensity,
      artifactBlockDensity,
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
  if (!glState) {
    log.error(lc.GL, 'updateScrollMetrics: No state provided')
    return
  }

  // Use scroll velocity from shared state if not provided
  const velocity = scrollVelocity || scrollState.velocity

  if (glState.ditheringPass?.uniforms) {
    const baseIntensity = 0.8
    const velocityMultiplier = Math.min(Math.abs(velocity) * 0.0001, 2.0) // Adjusted for pixels/second
    glState.ditheringPass.uniforms.intensity.value = baseIntensity + velocityMultiplier
  }
}
