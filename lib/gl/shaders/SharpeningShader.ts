/**
 * SharpeningShader.ts
 *
 * Shader for adding sharpening to the rendered image
 * Uses a simple unsharp mask approach with configurable strength
 */

import passthroughVertexShader from './glsl/passthrough.vert.ts'
import sharpeningFragmentShader from './glsl/sharpening.frag.ts'

export { passthroughVertexShader as sharpeningVertexShader, sharpeningFragmentShader }
