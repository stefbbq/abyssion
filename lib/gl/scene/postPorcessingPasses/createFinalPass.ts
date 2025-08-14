import * as Three from 'three'
import type { FinalPassParams } from '@lib/gl/configPostProcessing.types.ts'
import passthroughVertexShader from '@lib/gl/shaders/glsl/passthrough.vert.ts'
import { finalPassFragmentShader } from '@lib/gl/shaders/index.ts'
import { currentGLTheme } from '@lib/theme/index.ts'

export const createFinalPass = async (THREE: typeof Three, cfg?: FinalPassParams) => {
  if (!cfg?.enabled) return null
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')

  const glTheme = currentGLTheme.value
  const themePrimary = new THREE.Color(glTheme.primary)
  const themeAccent = new THREE.Color(glTheme.accent)
  const themeSecondary = new THREE.Color(glTheme.secondary)

  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      chromaStrength: { value: cfg.chromaStrength },
      gain: { value: cfg.gain ?? 1.0 },
      contrast: { value: cfg.contrast ?? 1.0 },
      segmentedGlitchMode: { value: 0 },
      glitchIntensity: { value: 0.7 },
      flickerRate: { value: 2.0 },
      colorPopIntensity: { value: 1 },
      themePrimary: { value: themePrimary.toArray() },
      themeAccent: { value: themeAccent.toArray() },
      themeSecondary: { value: themeSecondary.toArray() },
      blockSize: { value: 48 },
      blockOnProbability: { value: 0.0 },
      burstProbability: { value: 0.1 },
      vignetteEnabled: { value: cfg.vignette?.enabled === false ? 0 : 1 },
      vignetteStart: { value: cfg.vignette?.start ?? 0.4 },
      vignetteEnd: { value: cfg.vignette?.end ?? 0.85 },
      vignetteDarkness: { value: cfg.vignette?.darkness ?? 0.4 },
      vignetteDesaturation: { value: cfg.vignette?.desaturation ?? 0.25 },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: finalPassFragmentShader,
  })

  return pass
}
