import * as Three from 'three'
import passthroughVertexShader from '@lib/gl/shaders/glsl/passthrough.vert.ts'
import { pixelBleedFragmentShader } from '@lib/gl/shaders/index.ts'

export const createPixelBleedPass = async (THREE: typeof Three, width: number, height: number) => {
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(width, height) },
      intensity: { value: 0.0 },
      chunkSize: { value: 20.0 },
      chunkRandomness: { value: 0.5 },
      stretchDistance: { value: 0.3 },
      geometryComplexity: { value: 0.5 },
      persistence: { value: 0.5 },
      regenerationRate: { value: 0.4 },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: pixelBleedFragmentShader,
  })
  pass.enabled = false
  return pass
}
