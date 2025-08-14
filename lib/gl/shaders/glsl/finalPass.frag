// Chromatic aberration and glitch effect for final pass
// See: https://en.wikipedia.org/wiki/Chromatic_aberration
// See: https://en.wikipedia.org/wiki/Glitch_art
uniform sampler2D tDiffuse;
uniform float time;
uniform float chromaStrength;
uniform float gain;
uniform float contrast;
uniform float segmentedGlitchMode;
uniform float glitchIntensity;
uniform float flickerRate;
uniform float colorPopIntensity;
uniform float blockSize; // average block size
uniform float blockOnProbability; // chance a block is "on"
uniform float burstProbability; // chance of global burst
uniform vec3 themePrimary;
uniform vec3 themeAccent;
uniform vec3 themeSecondary;
// Vignette controls
uniform float vignetteEnabled;       // 0.0 disabled, 1.0 enabled
uniform float vignetteStart;         // radius where vignette starts [0..1]
uniform float vignetteEnd;           // radius where vignette is fully dark [0..1]
uniform float vignetteDarkness;      // max darkening amount [0..1]
uniform float vignetteDesaturation;  // max desaturation toward grayscale [0..1]
varying vec2 vUv;

// Hash for randomness. See: https://en.wikipedia.org/wiki/Hash_function
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}
float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

/**
 * segmented glitch effect
 * - large, variable, animated blocks that flicker in/out
 * - blocks are mostly off, with rare bursts of heavy glitch
 * - block size, on-probability, and burst probability are all tunable
 */
void main() {
  // Classic: subtle RGB split
  if (segmentedGlitchMode < 0.5) {
    float baseAberration = chromaStrength;
    float modulatedTime = mod(time, 10.0);
    float variation = sin(modulatedTime * 0.5) * 0.2;
    float displacement = clamp(baseAberration * (1.0 + variation), 0.0, chromaStrength * 1.5);

    // RGB split: https://en.wikipedia.org/wiki/Chromatic_aberration
    vec4 r = texture2D(tDiffuse, vUv + vec2(displacement, 0.0));
    vec4 g = texture2D(tDiffuse, vUv);
    vec4 b = texture2D(tDiffuse, vUv - vec2(displacement, 0.0));
    vec4 color = vec4(r.r, g.g, b.b, g.a);

    // Apply contrast
    color.rgb = ((color.rgb - 0.5) * contrast) + 0.5;

    // Configurable vignette
    if (vignetteEnabled > 0.5) {
      float r = distance(vUv, vec2(0.5));
      float t = smoothstep(vignetteStart, vignetteEnd, r);
      float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
      vec3 desaturated = mix(color.rgb, vec3(luminance), t * vignetteDesaturation);
      float darkness = mix(1.0, 1.0 - vignetteDarkness, t);
      color.rgb = desaturated * darkness;
    }

    gl_FragColor = color * gain;
    return;
  }

  // Segmented/flickery: animated blocks, color pops
  float minBlock = blockSize * 0.7;
  float maxBlock = blockSize * 1.3;
  float blockCountX = mix(8.0, 2.0, hash(time * 0.13)) + (32.0 / maxBlock);
  float blockCountY = mix(6.0, 2.0, hash(time * 0.23)) + (24.0 / maxBlock);
  vec2 block = floor(vUv * vec2(blockCountX, blockCountY));

  // Block on/off animation
  float blockAnimSeed = hash2(block + floor(time * flickerRate));
  float blockOn = step(1.0 - blockOnProbability, blockAnimSeed);

  // Rare global burst
  float burst = step(1.0 - burstProbability, hash(floor(time * 0.7)));

  // Glitch intensity for this block
  float localGlitch = glitchIntensity * blockOn;
  localGlitch = mix(localGlitch, glitchIntensity, burst);

  // Block size irregularity
  float blockSizeJitter = mix(minBlock, maxBlock, hash2(block + 100.0));

  // RGB split, more dramatic when glitched
  float displacement = chromaStrength * (1.0 + localGlitch * (1.0 + hash2(block + 10.0)) * (blockSizeJitter / blockSize));
  vec4 r = texture2D(tDiffuse, vUv + vec2(displacement, 0.0));
  vec4 g = texture2D(tDiffuse, vUv);
  vec4 b = texture2D(tDiffuse, vUv - vec2(displacement, 0.0));
  vec4 color = vec4(r.r, g.g, b.b, g.a);

  // Theme color pop: rare, block-based
  float colorPop = step(1.0 - colorPopIntensity * 0.5, hash2(block + 20.0));
  vec3 popColor = mix(themePrimary, themeAccent, hash2(block + 30.0));
  popColor = mix(popColor, themeSecondary, hash2(block + 40.0));
  color.rgb = mix(color.rgb, popColor, colorPop * 0.15 * colorPopIntensity);

  // Configurable vignette
  if (vignetteEnabled > 0.5) {
    float r = distance(vUv, vec2(0.5));
    float t = smoothstep(vignetteStart, vignetteEnd, r);
    float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 desaturated = mix(color.rgb, vec3(luminance), t * vignetteDesaturation);
    float darkness = mix(1.0, 1.0 - vignetteDarkness, t);
    color.rgb = desaturated * darkness;
  }

  gl_FragColor = color * gain;
} 