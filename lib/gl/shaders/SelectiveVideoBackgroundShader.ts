/**
 * SelectiveVideoBackgroundShader.ts
 *
 * Custom shader for video background with selective colorization
 * Grayscales the video but preserves/remaps high brightness/saturation areas to a target color
 */

import passthroughVertexShader from './glsl/passthrough.vert.ts'
import selectiveVideoBackgroundFragmentShader from './glsl/selectiveVideoBackground.frag.ts'

export { passthroughVertexShader, selectiveVideoBackgroundFragmentShader }
