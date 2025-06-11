// Sharpens the image using an unsharp mask
// See: https://en.wikipedia.org/wiki/Unsharp_masking
uniform sampler2D tDiffuse;
uniform float sharpStrength;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
  // Center pixel
  vec4 center = texture2D(tDiffuse, vUv);
  
  // Neighboring pixels for edge detection
  vec2 pixel = 1.0 / resolution;
  
  // Sample neighboring pixels
  vec4 top = texture2D(tDiffuse, vUv + vec2(0, -pixel.y));
  vec4 right = texture2D(tDiffuse, vUv + vec2(pixel.x, 0));
  vec4 bottom = texture2D(tDiffuse, vUv + vec2(0, pixel.y));
  vec4 left = texture2D(tDiffuse, vUv + vec2(-pixel.x, 0));
  
  // Laplacian edge detection
  // See: https://en.wikipedia.org/wiki/Kernel_(image_processing)
  vec4 laplacian = 4.0 * center - top - right - bottom - left;
  
  // Mix sharpened and original
  vec4 sharpened = center + laplacian * sharpStrength;
  
  // Clamp to valid color range
  gl_FragColor = clamp(sharpened, 0.0, 1.0);
} 