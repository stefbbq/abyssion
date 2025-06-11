// Applies blue noise dithering to reduce color banding. See: https://en.wikipedia.org/wiki/Dither
uniform sampler2D tDiffuse;
uniform float time;
uniform float ditherStrength;
uniform float ditherFrequency;
uniform float ditherAnimation;

varying vec2 vUv;

// Generates a repeatable random value from coordinates
// See: https://en.wikipedia.org/wiki/Linear_congruential_generator
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Blue noise: less visually distracting than white noise
// See: https://en.wikipedia.org/wiki/Blue_noise
float blueNoise(vec2 uv, float time) {
  float noise = 0.0;
  float frequency = ditherFrequency;
  float amplitude = 0.5;

  // Layer 1: base noise
  vec2 seed1 = uv * frequency + vec2(time * ditherAnimation, time * ditherAnimation * 2.0);
  noise += (random(seed1) * 2.0 - 1.0) * amplitude;

  // Layer 2: different frequency for more detail
  vec2 seed2 = uv * frequency * 1.7 + vec2(time * -ditherAnimation * 1.5, time * ditherAnimation);
  noise += (random(seed2) * 2.0 - 1.0) * amplitude * 0.5;

  // Layer 3: fine details
  vec2 seed3 = uv * frequency * 3.1 + vec2(time * ditherAnimation * 0.7, time * -ditherAnimation * 0.3);
  noise += (random(seed3) * 2.0 - 1.0) * amplitude * 0.25;

  // Normalize to 0-1
  return noise * 0.33 + 0.5;
}

void main() {
  // Sample the previous image
  vec4 color = texture2D(tDiffuse, vUv);

  // Add blue noise based on screen position
  float ditherNoise = blueNoise(gl_FragCoord.xy, time);

  // Mix noise into color to break up bands
  float ditherAmount = 1.0/255.0 * ditherStrength;
  vec3 dithered = color.rgb + (ditherNoise * 2.0 - 1.0) * ditherAmount;

  gl_FragColor = vec4(dithered, color.a);
} 