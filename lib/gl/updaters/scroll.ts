import { ShaderMaterial } from 'three'

import type { RendererState } from '../types.ts'
import { lc, log } from '../../logger/index.ts'
import configPostProcessing from '../configPostProcessing.json' with { type: 'json' }
import { getScrollCorruptionProgress } from '../scene/utils/getScrollCorruptionProgress.ts'
import {
  DITHERING_BASE_INTENSITY,
  DITHERING_VELOCITY_MAX,
  DITHERING_VELOCITY_MULTIPLIER,
  PIXELATION_BASE_SIZE,
  PIXELATION_MAX_SIZE,
  WAVE_NOISE_MIN_SCALE,
  WAVE_NOISE_RANGE,
  WHITE_NOISE_JITTER_MODULO,
  WHITE_NOISE_JITTER_STEP,
} from '@libgl/constants.ts'
import { getResponsiveScrollSpeed } from '../utils/getResponsiveScrollSpeed.ts'
import { type CorruptionParams, updateCRTShaderUniforms } from '../shaders/CRTShader.ts'
import type { PostProcessingConfig } from '../configPostProcessing.types.ts'
import { scrollState } from '../animation/state/scrollState.ts'
import { isDebugModeEnabled } from '../../debug/index.ts'
import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'

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

  /**
   * CAMERA
   * DESKTOP and MOBILE
   *
   * update the camera Y position and lookAt target based on scrollY
   */
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

  // on mobile devices, still update camera movement, but skip corruption shader math below
  const skipCorruption = isMobileDevice()

  /**
   * CRT SCROLL CORRUPTION bootstrap
   * DESKTOP ONLY from here on (for shader effects),
   * but we still compute scroll progress/intensity to drive non-CRT fades (e.g., backdrop shadow) on all devices
   */
  const crtConfig = ppConfig.crtScrollCorruption
  const { progress: scrollProgress, intensity: fadeIntensity } = getScrollCorruptionProgress(scrollY, crtConfig ?? {})

  /**
   * SHADOW LAYER
   * fade out the shadow layer at the same scroll thresholds/rate as the logo fade
   *
   * this should occur on all devices regardless of CRT enablement
   */
  if (state.shadowLayer?.mesh) {
    const material = state.shadowLayer.mesh.material as ShaderMaterial & { uniforms: { opacity?: { value: number } } }
    const uniforms = material.uniforms
    if (uniforms?.opacity) {
      if (typeof state.shadowLayer.mesh.userData.baseShadowOpacity !== 'number') {
        state.shadowLayer.mesh.userData.baseShadowOpacity = uniforms.opacity.value
      }
      const base = state.shadowLayer.mesh.userData.baseShadowOpacity as number
      // fade a bit faster than other elements (e.g., 2x), clamped to [0,1]
      const shadowFadeIntensity = Math.min(1, fadeIntensity * 2)
      uniforms.opacity.value = base * (1 - shadowFadeIntensity)
    }
  }

  if (!crtConfig?.enabled) { // if CRT corruption is disabled, skip the rest
    log.debug(lc.GL, 'updateScrollCorruption: CRT scroll corruption is disabled')
    return
  }

  // for shader effects, respect mobile gating
  const corruptionIntensity = skipCorruption ? 0 : fadeIntensity

  /**
   * LOGGING
   * log the scroll corruption progress and intensity
   */
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

  /**
   * CRT SCROLL CORRUPTION ends
   *
   * - updates the CRT shader uniforms if the material is available
   * - only updates when the CRT scroll corruption is enabled
   * - only updates when the scroll corruption intensity is greater than 0
   */
  if (!skipCorruption && state.crtPass?.material) {
    const material = state.crtPass.material as ShaderMaterial

    // compute readable, intermediate values instead of ternaries
    const rgbDistortionEnabled = crtConfig.rgbDistortion.enabled
    let rgbDistortionIntensity = 0
    let rgbDistortionFPS: number | undefined
    if (rgbDistortionEnabled) {
      const { minIntensity, maxIntensity, fps } = crtConfig.rgbDistortion as typeof crtConfig.rgbDistortion & { fps?: number }
      // apply per-effect FPS stepping if provided (for CPU-side modulation)
      const t = fps && fps > 0 ? Math.floor(performance.now() / (1000 / fps)) * (1000 / fps) : performance.now()
      const phase = (t % 1000) / 1000
      rgbDistortionIntensity = minIntensity +
        (corruptionIntensity * (maxIntensity - minIntensity)) * (0.7 + 0.3 * Math.sin(phase * Math.PI * 2))
      rgbDistortionFPS = fps
      // Push rgb wave/shape controls to shader uniforms from config
      if (material.uniforms.rgbWaveLargeScale) material.uniforms.rgbWaveLargeScale.value = crtConfig.rgbDistortion.waveLargeScale ?? 0.01
      if (material.uniforms.rgbWaveFineScale) material.uniforms.rgbWaveFineScale.value = crtConfig.rgbDistortion.waveFineScale ?? 0.02
      if (material.uniforms.rgbLineFrequency1) material.uniforms.rgbLineFrequency1.value = crtConfig.rgbDistortion.lineFrequency1 ?? 1.6
      if (material.uniforms.rgbLineFrequency2) material.uniforms.rgbLineFrequency2.value = crtConfig.rgbDistortion.lineFrequency2 ?? 2.0
      if (material.uniforms.rgbSeparationScale) material.uniforms.rgbSeparationScale.value = crtConfig.rgbDistortion.separationScale ?? 1.0
      if (material.uniforms.rgbWaveAmplitude) material.uniforms.rgbWaveAmplitude.value = crtConfig.rgbDistortion.waveAmplitude ?? 1.0
      if (material.uniforms.rgbLineThreshold1) material.uniforms.rgbLineThreshold1.value = crtConfig.rgbDistortion.lineThreshold1 ?? 0.999
      if (material.uniforms.rgbLineThreshold2) material.uniforms.rgbLineThreshold2.value = crtConfig.rgbDistortion.lineThreshold2 ?? 0.9995
      if (material.uniforms.rgbShapeMode) {
        const m = crtConfig.rgbDistortion.shapeMode
        material.uniforms.rgbShapeMode.value = m === 'triangle' ? 1.0 : m === 'block' ? 2.0 : 0.0
      }
    }

    const blockCorruptionEnabled = crtConfig.blockCorruption.enabled
    let blockCorruptionRate = 0
    if (blockCorruptionEnabled) {
      const { minRate, maxRate, fps } = crtConfig.blockCorruption as typeof crtConfig.blockCorruption & { fps?: number }
      const baseRate = minRate + (corruptionIntensity * (maxRate - minRate))
      if (fps && fps > 0) {
        const step = 1 / fps
        blockCorruptionRate = Math.max(1, Math.round(baseRate * step) / step)
      } else {
        blockCorruptionRate = baseRate
      }
    }

    const whiteNoiseEnabled = crtConfig.whiteNoise.enabled
    let whiteNoiseIntensity = 0
    let whiteNoiseFPS: number | undefined
    if (whiteNoiseEnabled) {
      const { minIntensity, maxIntensity, fps } = crtConfig.whiteNoise as typeof crtConfig.whiteNoise & { fps?: number }
      const base = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
      if (fps && fps > 0) {
        const t = Math.floor(performance.now() / (1000 / fps))
        // pseudo-random jitter range around base to avoid repetition
        const jitter = ((t % WHITE_NOISE_JITTER_MODULO) - Math.floor(WHITE_NOISE_JITTER_MODULO / 2)) * WHITE_NOISE_JITTER_STEP
        whiteNoiseIntensity = Math.max(0, base * (1 + jitter))
      } else {
        whiteNoiseIntensity = base
      }
      whiteNoiseFPS = fps
    }

    const waveNoiseEnabled = crtConfig.waveNoise.enabled
    let waveNoiseIntensity = 0
    let waveNoiseFPS: number | undefined
    if (waveNoiseEnabled) {
      const { minIntensity, maxIntensity, fps } = crtConfig.waveNoise as typeof crtConfig.waveNoise & { fps?: number }
      const base = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
      if (fps && fps > 0) {
        const t = Math.floor(performance.now() / (1000 / fps))
        // subtle stepping wave
        waveNoiseIntensity = base * (WAVE_NOISE_MIN_SCALE + WAVE_NOISE_RANGE * ((t % 5) / 4))
      } else {
        waveNoiseIntensity = base
      }
      waveNoiseFPS = fps
    }

    let staticIntensity = 0
    if (crtConfig.staticIntensity.enabled) {
      const { minIntensity, maxIntensity, fps } = crtConfig.staticIntensity as typeof crtConfig.staticIntensity & { fps?: number }
      const base = minIntensity + (corruptionIntensity * (maxIntensity - minIntensity))
      if (fps && fps > 0) {
        const t = Math.floor(performance.now() / (1000 / fps))
        const toggle = (t % 2) === 0 ? 0.95 : 1.05
        staticIntensity = base * toggle
      } else {
        staticIntensity = base
      }
    }

    const largeBlockEnabled = crtConfig.largeBlockCorruption.enabled && corruptionIntensity > crtConfig.largeBlockCorruption.startThreshold
    let largeBlockIntensity = 0
    if (largeBlockEnabled) {
      const { startThreshold, maxIntensity, fps } = crtConfig.largeBlockCorruption as typeof crtConfig.largeBlockCorruption & {
        fps?: number
      }
      const t = (corruptionIntensity - startThreshold) / (1.0 - startThreshold)
      const base = t * maxIntensity
      if (fps && fps > 0) {
        const step = 1 / fps
        largeBlockIntensity = Math.round(base / step) * step
      } else {
        largeBlockIntensity = base
      }
    }

    const artifactNoiseEnabled = crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold
    let artifactNoiseIntensity = 0
    let artifactBlockDensity = 0
    if (artifactNoiseEnabled) {
      const { startThreshold, maxIntensity, artifactBlockDensity: defaultDensity, fps } = crtConfig.artifactNoise as
        & typeof crtConfig.artifactNoise
        & { fps?: number }
      const t = (corruptionIntensity - startThreshold) / (1.0 - startThreshold)
      const base = t * maxIntensity
      artifactNoiseIntensity = base
      const density = defaultDensity ?? 0.7
      artifactBlockDensity = t * density

      // if fps specified, prefer it as the driving frequency
      if (typeof fps === 'number' && fps > 0) {
        material.uniforms.artifactNoiseFPS && (material.uniforms.artifactNoiseFPS.value = fps)
      }
      // theme tinting control
      const useTheme = (ppConfig.crtScrollCorruption as PostProcessingConfig['crtScrollCorruption'])?.artifactNoise?.useThemeColors
      if (material.uniforms.artifactUseTheme) material.uniforms.artifactUseTheme.value = useTheme ? 1.0 : 0.0
    }

    // update the CRT shader uniforms
    const corruptionParams: CorruptionParams = {
      enabled: corruptionIntensity > 0.0,
      intensity: corruptionIntensity,
      timeEnabled: true,
      rgbDistortionEnabled,
      rgbDistortionIntensity,
      rgbDistortionFPS,
      blockCorruptionEnabled,
      blockCorruptionRate,
      whiteNoiseEnabled,
      whiteNoiseIntensity,
      whiteNoiseFPS,
      waveNoiseEnabled,
      waveNoiseIntensity,
      waveNoiseFPS,
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

    // set debug overlay state: only on when global debug mode is enabled AND config allows it
    if (material.uniforms.debugOverlayEnabled) {
      const overlayConfigured = (ppConfig.crtScrollCorruption as PostProcessingConfig['crtScrollCorruption'])?.debugOverlay?.enabled
      const isDebug = isDebugModeEnabled()
      material.uniforms.debugOverlayEnabled.value = isDebug && !!overlayConfigured ? 1.0 : 0.0
    }

    // keep theme colors in sync for artifact tinting on every update (theme can change live)
    try {
      // inline import to avoid circular deps at module top
      // deno-lint-ignore no-explicit-any
      const themeMod: any = (globalThis as any).__abyssionThemeMod || (globalThis as any).abyssionThemeMod
      if (themeMod?.currentGLTheme) {
        const glTheme = themeMod.currentGLTheme.value
        // deno-lint-ignore no-explicit-any
        const THREE: any = (globalThis as any).THREE || undefined
        if (THREE) {
          if (material.uniforms.themePrimary) material.uniforms.themePrimary.value = new THREE.Color(glTheme.primary).toArray()
          if (material.uniforms.themeAccent) material.uniforms.themeAccent.value = new THREE.Color(glTheme.accent).toArray()
          if (material.uniforms.themeSecondary) material.uniforms.themeSecondary.value = new THREE.Color(glTheme.secondary).toArray()
        }
      }
    } catch (_) { /* no-op */ }
  }

  if (state.pixelBleedPass?.material) {
    const material = state.pixelBleedPass.material as ShaderMaterial
    if (material.uniforms && state.pixelBleedPass.enabled) {
      material.uniforms.time.value = performance.now() / 1000
    }
  }

  if (state.pixelationPass) {
    const pixelSize = PIXELATION_BASE_SIZE + (corruptionIntensity * (PIXELATION_MAX_SIZE - PIXELATION_BASE_SIZE))
    if (state.pixelationPass.uniforms.pixelSize) state.pixelationPass.uniforms.pixelSize.value = pixelSize
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
    const velocityMultiplier = Math.min(Math.abs(velocity) * DITHERING_VELOCITY_MULTIPLIER, DITHERING_VELOCITY_MAX)
    glState.ditheringPass.uniforms.intensity.value = DITHERING_BASE_INTENSITY + velocityMultiplier
  }
}
