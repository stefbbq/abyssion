/**
 * PixelBleedShader.ts
 *
 * Advanced pixel bleed corruption effect that creates geometric pixel stretching
 * corruption by sampling pixels from shape outlines and stretching them in fixed
 * directions. This creates bold, clean digital corruption effects that simulate
 * pixel data being "pulled" or "stretched" from geometric sources.
 *
 * ## Core Concept
 * The shader generates geometric shapes (triangles, rectangles, diamonds) at random
 * positions and samples pixels from specific portions of their outlines. It then
 * stretches these pixels in one of three fixed directions:
 * - Down (90°): Vertical downward stretching
 * - Right (0°): Horizontal rightward stretching
 * - Down-Right (45°): Diagonal stretching
 *
 * ## Technical Details
 * - **Outline Sampling**: Only samples from "active" portions of shape outlines
 *   - Triangle: Top two edges (from apex to corners)
 *   - Rectangle: Top edge only
 *   - Diamond: Top-right diagonal edge only
 * - **Backward Tracing**: Traces from current pixel backwards to find source
 * - **Bold Replacement**: Direct pixel duplication without tapering or fading
 * - **Lifecycle Management**: Corruption areas persist for configurable duration
 *
 * ## Visual Effect
 * Creates the appearance of pixels being "stretched" from geometric shapes in
 * straight lines, simulating digital corruption or glitch effects similar to
 * GPU memory corruption or digital signal processing artifacts.
 *
 * @performance Optimized for real-time rendering with configurable complexity
 * @compatibility Works with Three.js post-processing pipeline via ShaderPass
 */

import * as Three from 'three'
import passthroughVertexShader from './glsl/passthrough.vert.ts'
import pixelBleedFragmentShader from './glsl/pixelBleed.frag.ts'
import { lc, log } from '@lib/logger/index.ts'

export { passthroughVertexShader as pixelBleedVertexShader, pixelBleedFragmentShader }

/**
 * Configuration options for the pixel bleed effect
 *
 * These parameters control the appearance and behavior of the pixel bleed
 * corruption effect. Each parameter affects different aspects of the
 * geometric pixel stretching algorithm.
 */
export type PixelBleedConfig = {
  /**
   * Overall effect intensity (0.0 to 1.0)
   * - 0.0: Effect completely disabled
   * - 0.5: Moderate corruption with balanced visibility
   * - 1.0: Maximum corruption intensity
   */
  intensity: number

  /**
   * Size of geometric shapes used for corruption (5.0 to 200.0)
   * - 5.0: Very small, fine-grained corruption
   * - 30.0: Medium-sized corruption blocks (default)
   * - 200.0: Large, dramatic corruption areas
   */
  chunkSize: number

  /**
   * Randomness in corruption center placement (0.0 to 1.0)
   * - 0.0: Perfect grid placement
   * - 0.5: Moderate randomness (default)
   * - 1.0: Completely random placement
   */
  chunkRandomness: number

  /**
   * Maximum distance pixels can stretch (0.0 to 0.5)
   * - 0.0: No stretching (effect disabled)
   * - 0.3: Moderate stretching (default)
   * - 0.5: Maximum stretching (half screen width/height)
   */
  stretchDistance: number

  /**
   * Complexity of geometric corruption shapes (0.0 to 1.0)
   * - 0.0: Simple shapes only
   * - 0.7: Mixed complexity (default)
   * - 1.0: Maximum shape complexity
   */
  geometryComplexity: number

  /**
   * How long corruption effects persist (0.0 to 1.0)
   * - 0.0: No persistence, corruption disappears immediately
   * - 0.6: Moderate persistence (default)
   * - 1.0: Maximum persistence, corruption builds up over time
   */
  persistence: number

  /**
   * Rate of new corruption generation (0.0 to 1.0)
   * - 0.0: No new corruption generated
   * - 0.4: Moderate regeneration (default)
   * - 1.0: Rapid, continuous corruption generation
   */
  regenerationRate: number
}

/**
 * Default configuration for the pixel bleed effect
 */
export const defaultPixelBleedConfig: PixelBleedConfig = {
  intensity: 0.0,
  chunkSize: 20.0,
  chunkRandomness: 0.5,
  stretchDistance: 0.3,
  geometryComplexity: 0.5,
  persistence: 0.5,
  regenerationRate: 0.4,
}

/**
 * Pixel Bleed Shader object for Three.js
 *
 * This shader object provides the complete shader definition for the pixel bleed
 * corruption effect, including all required uniforms, vertex shader, and fragment
 * shader. It's designed to work with Three.js's ShaderPass in post-processing
 * pipelines.
 *
 * ## Uniforms
 * - `tDiffuse`: Input texture (automatically set by post-processing)
 * - `resolution`: Screen resolution for UV calculations
 * - `time`: Animation time for dynamic effects
 * - `intensity`: Master intensity control
 * - `chunkSize`: Size of corruption shapes
 * - `chunkRandomness`: Randomness in shape placement
 * - `stretchDistance`: Maximum pixel stretch distance
 * - `geometryComplexity`: Shape complexity level
 * - `persistence`: Corruption persistence over time
 * - `regenerationRate`: New corruption generation rate
 *
 * ## Usage
 * ```typescript
 * import { PixelBleedShader } from './PixelBleedShader.ts'
 *
 * const pass = new ShaderPass(PixelBleedShader)
 * pass.uniforms.intensity.value = 0.5
 * pass.uniforms.chunkSize.value = 25.0
 * composer.addPass(pass)
 * ```
 *
 * @performance All uniforms default to disabled state for optimal performance
 * @compatibility Requires WebGL 1.0 or higher
 */
export const PixelBleedShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: null },
    time: { value: 0.0 },
    intensity: { value: 0.0 },
    chunkSize: { value: 20.0 },
    chunkRandomness: { value: 0.5 },
    stretchDistance: { value: 0.3 },
    geometryComplexity: { value: 0.5 },
    persistence: { value: 0.5 },
    regenerationRate: { value: 0.5 },
  },
  vertexShader: passthroughVertexShader,
  fragmentShader: pixelBleedFragmentShader,
}

/**
 * Creates a pixel bleed shader material with the specified configuration
 *
 * This convenience function creates a fully configured Three.js ShaderMaterial
 * with the pixel bleed effect. It merges the provided configuration with
 * default values and sets up all necessary uniforms.
 *
 * @param THREE - Three.js library instance
 * @param config - Partial configuration object (merged with defaults)
 * @returns Configured ShaderMaterial ready for use
 *
 * @example
 * ```typescript
 * import * as THREE from 'three'
 * import { createPixelBleedMaterial } from './PixelBleedShader.ts'
 *
 * // Create material with custom settings
 * const material = createPixelBleedMaterial(THREE, {
 *   intensity: 0.7,
 *   chunkSize: 40.0,
 *   stretchDistance: 0.4
 * })
 *
 * // Use in a mesh or post-processing pass
 * const mesh = new THREE.Mesh(geometry, material)
 * ```
 *
 * @performance Material is created with performance-optimized defaults
 * @note This function is an alternative to using PixelBleedShader directly
 */
export const createPixelBleedMaterial = (THREE: typeof Three, config: Partial<PixelBleedConfig> = {}) => {
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

/**
 * Updates pixel bleed shader uniforms from configuration
 *
 * This function efficiently updates all pixel bleed shader uniforms based on
 * the provided configuration. It handles proper uniform updates with null-checking
 * and automatically manages time-based animation based on the intensity setting.
 *
 * The function is designed for real-time updates and can be called every frame
 * or in response to user input changes.
 *
 * @param material - Three.js ShaderMaterial with pixel bleed uniforms
 * @param config - Complete pixel bleed configuration
 *
 * @example
 * ```typescript
 * // Update shader in animation loop
 * const config: PixelBleedConfig = {
 *   intensity: 0.8,
 *   chunkSize: 25.0,
 *   chunkRandomness: 0.6,
 *   stretchDistance: 0.3,
 *   geometryComplexity: 0.7,
 *   persistence: 0.5,
 *   regenerationRate: 0.4
 * }
 *
 * updatePixelBleedShaderUniforms(pixelBleedMaterial, config)
 * ```
 *
 * @performance Includes null checks for safety and efficiency
 * @note Time uniform is automatically updated when intensity > 0
 */
export const updatePixelBleedShaderUniforms = (material: Three.ShaderMaterial, config: PixelBleedConfig) => {
  if (!material.uniforms) {
    log.error(lc.GL, 'PixelBleedShader uniforms are not set')
    return
  }

  const { uniforms } = material
  const { intensity, chunkSize, chunkRandomness, stretchDistance, geometryComplexity, persistence, regenerationRate } = config

  if (uniforms.intensity) uniforms.intensity.value = intensity
  if (uniforms.time) uniforms.time.value = intensity > 0 ? performance.now() / 1000 : 0.0
  if (uniforms.chunkSize) uniforms.chunkSize.value = chunkSize
  if (uniforms.chunkRandomness) uniforms.chunkRandomness.value = chunkRandomness
  if (uniforms.stretchDistance) uniforms.stretchDistance.value = stretchDistance
  if (uniforms.geometryComplexity) uniforms.geometryComplexity.value = geometryComplexity
  if (uniforms.persistence) uniforms.persistence.value = persistence
  if (uniforms.regenerationRate) uniforms.regenerationRate.value = regenerationRate
}
