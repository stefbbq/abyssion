import passthroughVertexShader from '@lib/gl/shaders/glsl/passthrough.vert.ts'
import { ditheringFragmentShader } from '@lib/gl/shaders/index.ts'
import type { FinalPassParams } from '@lib/gl/configPostProcessing.types.ts'

export const createDitheringPass = async (cfg?: FinalPassParams) => {
  if (!cfg) return null
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      ditherStrength: { value: cfg.ditherStrength },
      ditherFrequency: { value: cfg.ditherFrequency },
      ditherAnimation: { value: cfg.ditherAnimation },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: ditheringFragmentShader,
  })
  pass.renderToScreen = true
  return pass
}
