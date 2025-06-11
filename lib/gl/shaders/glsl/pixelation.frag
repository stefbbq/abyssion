// Pixelates the image by snapping UVs to a grid
// See: https://en.wikipedia.org/wiki/Pixelation
uniform sampler2D tDiffuse;
uniform float pixelSize;
uniform vec2 resolution;
varying vec2 vUv;
void main() {
  // Snap UVs to a grid to create pixel blocks
  vec2 dxy = pixelSize / resolution;
  vec2 coord = dxy * floor(vUv / dxy) + dxy * 0.25;
  gl_FragColor = texture2D(tDiffuse, coord);
} 