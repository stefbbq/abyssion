// Vertex shader (pass-through)
export const pixelationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader for pixelation effect
export const pixelationFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float pixelSize;
  uniform vec2 resolution;
  varying vec2 vUv;
  void main() {
    // Calculate the size of each pixel block in UV space
    vec2 dxy = pixelSize / resolution;
    vec2 coord = dxy * floor(vUv / dxy) + dxy * 0.25;
    gl_FragColor = texture2D(tDiffuse, coord);
  }
`
