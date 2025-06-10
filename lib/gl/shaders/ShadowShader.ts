export const shadowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const shadowFragmentShader = `
  uniform float opacity;
  varying vec2 vUv;
  
  void main() {
    // Calculate distance from center (0.5, 0.5)
    vec2 center = vec2(0.5, 0.5);
    float dist = length((vUv - center) * vec2(1.0, 0.5)); // Scale Y to make it more elliptical
    
    // Smaller solid core, sharper fade
    float coreSize = 0.0;
    float fadeStart = .03;
    float fadeEnd = .25;
    float alpha = 1.0;

    if (dist > coreSize) {
      alpha = smoothstep(fadeEnd, fadeStart, dist) * opacity;
    } else {
      alpha = opacity;
    }
    
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
  }
`
