/**
 * PixelBleedShader.ts
 *
 * Advanced pixel bleed corruption effect that samples large chunks of the image
 * and stretches them using geometric shapes (triangles, rectangles, diamonds).
 * Creates a computerized corruption that builds on itself over time.
 */

import passthroughVertexShader from './glsl/passthrough.vert.ts'
import pixelBleedFragmentShader from './glsl/pixelBleed.frag.ts'

export { passthroughVertexShader as pixelBleedVertexShader, pixelBleedFragmentShader }

/**
 * Configuration options for the pixel bleed effect
 */
export type PixelBleedConfig = {
  /** Overall effect intensity (0.0 to 1.0) */
  intensity: number
  /** Size of pixel chunks to sample (1.0 to 100.0) */
  chunkSize: number
  /** Randomness in chunk placement (0.0 to 1.0) */
  chunkRandomness: number
  /** How far pixels stretch (0.0 to 1.0) */
  stretchDistance: number
  /** Complexity of geometric shapes (0.0 to 1.0) */
  geometryComplexity: number
  /** How much corruption persists/builds (0.0 to 1.0) */
  persistence: number
  /** How often new corruption spawns (0.0 to 1.0) */
  regenerationRate: number
}

/**
 * Default configuration for the pixel bleed effect
 */
export const defaultPixelBleedConfig: PixelBleedConfig = {
  intensity: 0.0,
  chunkSize: 30.0,
  chunkRandomness: 0.5,
  stretchDistance: 0.3,
  geometryComplexity: 0.7,
  persistence: 0.6,
  regenerationRate: 0.4,
}

/**
 * Creates a pixel bleed shader material with the specified configuration
 */
export const createPixelBleedMaterial = (THREE: any, config: Partial<PixelBleedConfig> = {}) => {
  const finalConfig = { ...defaultPixelBleedConfig, ...config }

  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2(1920, 1080) },
      intensity: { value: finalConfig.intensity },
      chunkSize: { value: finalConfig.chunkSize },
      chunkRandomness: { value: finalConfig.chunkRandomness },
      stretchDistance: { value: finalConfig.stretchDistance },
      geometryComplexity: { value: finalConfig.geometryComplexity },
      persistence: { value: finalConfig.persistence },
      regenerationRate: { value: finalConfig.regenerationRate },
    },
    vertexShader: passthroughVertexShader,
    fragmentShader: pixelBleedFragmentShader,
  })
}
