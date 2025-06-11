import * as Three from 'three'
import type { ShaderParams } from './index.ts'
import passthroughVertexShader from './glsl/passthrough.vert.ts'
import fragmentShaderSource from './glsl/electric.frag.ts'
import finalPassFragmentShaderSource from './glsl/finalPass.frag.ts'

// Vertex shader
export const vertexShader = passthroughVertexShader

// Fragment shader with electric effect
export const fragmentShader = fragmentShaderSource

// Final post-processing shader
export const finalPassVertexShader = passthroughVertexShader

/**
 * finalPassFragmentShader
 *
 * Chromatic aberration and color pop effect with segmented, flickery bands.
 * - If segmentedGlitchMode is 0, use classic effect.
 * - If segmentedGlitchMode is 1, apply segmented, flickery, theme-colored bands.
 *
 * Uniforms:
 *   tDiffuse: main scene texture
 *   time: animation time
 *   chromaStrength: base chromatic aberration strength
 *   gain: output gain
 *   segmentedGlitchMode: 0 = classic, 1 = segmented/flickery
 *   glitchIntensity: controls how strong the segmented effect is
 *   flickerRate: controls how fast bands flicker
 *   colorPopIntensity: how much theme color pops in
 *   themePrimary, themeAccent, themeSecondary: theme colors (vec3)
 */
export const finalPassFragmentShader = finalPassFragmentShaderSource

// Factory function to create the electric shader material
export const createElectricShaderMaterial = (
  THREE: typeof Three,
  params: ShaderParams,
) => {
  const { texture, color, opacity, noiseScale, noiseOffset, isStencil } = params

  // Different material settings based on layer type
  if (isStencil) {
    // For stencil, use additive blending like other layers
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        color: { value: color },
        opacity: { value: opacity },
        time: { value: 0.0 },
        noiseScale: { value: noiseScale },
        noiseOffset: { value: noiseOffset },
        isStencil: { value: true },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false, // Don't write to depth buffer
      depthTest: true, // Do test against depth buffer
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  } else {
    // For electric outlines, use additive blending
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        color: { value: color },
        opacity: { value: opacity },
        time: { value: 0.0 },
        noiseScale: { value: noiseScale },
        noiseOffset: { value: noiseOffset },
        isStencil: { value: false },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false, // Disable depth writing for better blending
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  }
}
