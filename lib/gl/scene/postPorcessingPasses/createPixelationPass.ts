import * as Three from 'three'
import type { PixelateParams } from '@lib/gl/configPostProcessing.types.ts'
import passthroughVertexShader from '@lib/gl/shaders/glsl/passthrough.vert.ts'
import { pixelationFragmentShader } from '@lib/gl/shaders/index.ts'

export const createPixelationPass = async (
  THREE: typeof Three,
  width: number,
  height: number,
  pixelate?: PixelateParams,
) => {
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const cfg = pixelate ?? { enabled: false, pixelSize: 16 }
  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      pixelSize: { value: cfg.pixelSize },
      resolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: pixelationFragmentShader,
  })
  pass.enabled = !!cfg.enabled
  return pass
}
