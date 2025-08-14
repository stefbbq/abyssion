import * as Three from 'three'
import type { CrtScrollCorruptionParams, PostProcessingConfig } from '@lib/gl/configPostProcessing.types.ts'
import { CRTShader } from '@lib/gl/shaders/CRTShader.ts'
import { currentGLTheme } from '@lib/theme/index.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import { lc, log } from '@lib/logger/index.ts'

export const createCRTPass = async (
  THREE: typeof Three,
  width: number,
  height: number,
  cfg?: CrtScrollCorruptionParams,
) => {
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const pass = new ShaderPass(CRTShader)
  pass.enabled = cfg?.enabled ?? false

  if (pass.material && pass.material.uniforms.resolution) {
    pass.material.uniforms.resolution.value = new THREE.Vector2(width, height)
  }

  if (pass.material && pass.material.uniforms) {
    const u = pass.material.uniforms
    const glTheme = currentGLTheme.value
    const themePrimaryColor = new THREE.Color(glTheme.primary)
    const themeAccentColor = new THREE.Color(glTheme.accent)
    const themeSecondaryColor = new THREE.Color(glTheme.secondary)
    if (u.themePrimary) u.themePrimary.value = themePrimaryColor.toArray()
    if (u.themeAccent) u.themeAccent.value = themeAccentColor.toArray()
    if (u.themeSecondary) u.themeSecondary.value = themeSecondaryColor.toArray()
  }

  log.debug(lc.GL, 'crtPass config', cfg)
  log.debug(lc.GL, 'crtPass rgbDistortion fps', cfg?.rgbDistortion?.fps)

  if (pass.material && pass.material.uniforms && cfg) {
    const u = pass.material.uniforms
    if (u.rgbDistortionFPS) u.rgbDistortionFPS.value = cfg.rgbDistortion?.fps ?? 0

    if (u.rgbWaveLargeScale && cfg.rgbDistortion?.waveLargeScale !== undefined) u.rgbWaveLargeScale.value = cfg.rgbDistortion.waveLargeScale
    if (u.rgbWaveFineScale && cfg.rgbDistortion?.waveFineScale !== undefined) u.rgbWaveFineScale.value = cfg.rgbDistortion.waveFineScale
    if (u.rgbLineFrequency1 && cfg.rgbDistortion?.lineFrequency1 !== undefined) u.rgbLineFrequency1.value = cfg.rgbDistortion.lineFrequency1
    if (u.rgbLineFrequency2 && cfg.rgbDistortion?.lineFrequency2 !== undefined) u.rgbLineFrequency2.value = cfg.rgbDistortion.lineFrequency2
    if (u.rgbSeparationScale && cfg.rgbDistortion?.separationScale !== undefined) u.rgbSeparationScale.value = cfg.rgbDistortion.separationScale
    if (u.rgbShapeMode && cfg.rgbDistortion?.shapeMode !== undefined) {
      const m = cfg.rgbDistortion.shapeMode
      u.rgbShapeMode.value = m === 'triangle' ? 1.0 : m === 'block' ? 2.0 : 0.0
    }
    if (u.rgbWaveAmplitude && cfg.rgbDistortion?.waveAmplitude !== undefined) u.rgbWaveAmplitude.value = cfg.rgbDistortion.waveAmplitude
    if (u.rgbLineThreshold1 && cfg.rgbDistortion?.lineThreshold1 !== undefined) u.rgbLineThreshold1.value = cfg.rgbDistortion.lineThreshold1
    if (u.rgbLineThreshold2 && cfg.rgbDistortion?.lineThreshold2 !== undefined) u.rgbLineThreshold2.value = cfg.rgbDistortion.lineThreshold2
    if (u.whiteNoiseFPS) u.whiteNoiseFPS.value = cfg.whiteNoise?.fps ?? 0
    if (u.waveNoiseFPS) u.waveNoiseFPS.value = cfg.waveNoise?.fps ?? 0
    if (u.largeBlockFPS) u.largeBlockFPS.value = cfg.largeBlockCorruption?.fps ?? u.largeBlockFPS.value
    if (u.artifactNoiseFPS) u.artifactNoiseFPS.value = cfg.artifactNoise?.fps ?? cfg.artifactNoise?.artifactNoiseFPS ?? u.artifactNoiseFPS.value
  }

  if (pass.material && pass.material.uniforms && pass.material.uniforms.debugOverlayEnabled) {
    const debugOverlayConfigured = (cfg as PostProcessingConfig['crtScrollCorruption'])?.debugOverlay?.enabled
    const isDebug = isDebugModeEnabled()
    pass.material.uniforms.debugOverlayEnabled.value = isDebug && !!debugOverlayConfigured ? 1.0 : 0.0
  }

  return pass
}



