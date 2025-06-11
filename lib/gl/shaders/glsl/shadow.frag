// Draws a soft elliptical shadow with a sharp core
// See: https://en.wikipedia.org/wiki/Smoothstep
uniform float opacity;
varying vec2 vUv;

void main() {
  // Distance from center (0.5, 0.5)
  vec2 center = vec2(0.5, 0.5);
  float dist = length((vUv - center) * vec2(1.0, 0.5)); // Elliptical scaling

  // Core and fade regions
  float coreSize = 0.0;
  float fadeStart = .03;
  float fadeEnd = .25;
  float alpha = 1.0;

  // Use smoothstep for soft fade
  if (dist > coreSize) {
    alpha = smoothstep(fadeEnd, fadeStart, dist) * opacity;
  } else {
    alpha = opacity;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
} 