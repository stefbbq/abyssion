/**
 * SharpeningShader.ts
 *
 * Shader for adding sharpening to the rendered image
 * Uses a simple unsharp mask approach with configurable strength
 */

// Vertex shader (pass-through)
export const sharpeningVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader with unsharp mask
export const sharpeningFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float sharpStrength;
  uniform vec2 resolution;
  
  varying vec2 vUv;
  
  void main() {
    // Get the target pixel
    vec4 center = texture2D(tDiffuse, vUv);
    
    // Calculate pixel size for sampling
    vec2 pixel = 1.0 / resolution;
    
    // Sample neighboring pixels
    vec4 top = texture2D(tDiffuse, vUv + vec2(0, -pixel.y));
    vec4 right = texture2D(tDiffuse, vUv + vec2(pixel.x, 0));
    vec4 bottom = texture2D(tDiffuse, vUv + vec2(0, pixel.y));
    vec4 left = texture2D(tDiffuse, vUv + vec2(-pixel.x, 0));
    
    // Calculate laplacian edges (common sharpening kernel)
    vec4 laplacian = 4.0 * center - top - right - bottom - left;
    
    // Apply sharpening with adjustable strength
    // Mix between original and sharpened version based on strength
    vec4 sharpened = center + laplacian * sharpStrength;
    
    // Prevent over-brightening with a simple clamp
    gl_FragColor = clamp(sharpened, 0.0, 1.0);
  }
`
