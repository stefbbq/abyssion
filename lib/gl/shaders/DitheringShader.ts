/**
 * DitheringShader.ts
 *
 * Dedicated shader for blue noise dithering to reduce banding artifacts
 * Applied as the final post-processing step
 */

import passthroughVertexShader from './glsl/passthrough.vert.ts'
import ditheringFragmentShader from './glsl/dithering.frag.ts'

export { ditheringFragmentShader, passthroughVertexShader as ditheringVertexShader }
