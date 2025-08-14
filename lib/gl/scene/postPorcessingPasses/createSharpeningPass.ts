import * as Three from 'three'
import type { SharpeningParams } from '@lib/gl/configPostProcessing.types.ts'
import passthroughVertexShader from '@lib/gl/shaders/glsl/passthrough.vert.ts'
import { sharpeningFragmentShader } from '@lib/gl/shaders/index.ts'

export const createSharpeningPass = async (
  THREE: typeof Three,
  width: number,
  height: number,
  cfg?: SharpeningParams,
) => {
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const sharpening = cfg ?? { strength: 0.2, enabled: false }
  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      sharpStrength: { value: sharpening.strength ?? 0.2 },
      resolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: sharpeningFragmentShader,
  })
  pass.enabled = !!sharpening.enabled
  return pass
}



