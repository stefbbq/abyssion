import * as Three from 'three'
import type { ShaderParams } from './index.ts'

// Vertex shader
export const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader with electric effect
export const fragmentShader = `
  uniform sampler2D map;
  uniform vec3 color;
  uniform float opacity;
  uniform float time;
  uniform float noiseScale;
  uniform float noiseOffset;
  uniform bool isStencil;
  
  varying vec2 vUv;
  
  // Simplex noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  
                       0.366025403784439,  
                       -0.577350269189626,  
                       0.024390243902439); 
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Added a function to create more dramatic, sharp transitions
  float sharpTransition(float value, float edge, float smoothness) {
    return smoothstep(edge - smoothness, edge + smoothness, value);
  }
  
  void main() {
    // Sample the texture
    vec4 texColor = texture2D(map, vUv);
    
    // Generate noise based on UV coordinates and time
    // The time value is now updated at a lower framerate
    float noise = snoise(vUv * noiseScale + time * 0.1) * 0.5 + 0.5;
    
    // Create more dramatic edge effects with sharp transitions
    noise = sharpTransition(noise, noiseOffset, 0.1);
    
    // Make some parts of the effect flicker randomly based on time
    float flicker = sharpTransition(snoise(vec2(time * 0.2, 0.0)), 0.4, 0.1);
    noise *= mix(0.85, 1.0, flicker);
    
    // Apply different effects based on layer type
    if (isStencil) {
      // For stencil textures, make them solid with minimal noise effects
      // Keep original texture RGB but use a more solid alpha
      float stencilNoise = mix(0.95, 1.0, noise); // Very subtle noise effect
      float alpha = texColor.a * stencilNoise * opacity;
      
      // Output with minimal noise influence and adjusted alpha
      // Set alpha to create a stencil effect without fully occluding
      // This allows other layers to show through based on their depth
      gl_FragColor = vec4(color * texColor.rgb, alpha);
    } else {
      // For outline textures, use the full electric effect
      float alpha = texColor.a * noise * opacity;
      gl_FragColor = vec4(color * texColor.rgb, alpha);
    }
  }
`

// Final post-processing shader
export const finalPassVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * finalPassFragmentShader
 *
 * Chromatic aberration and color pop effect with segmented, flickery bands.
 * - If segmentedGlitchMode is 0, use classic effect.
 * - If segmentedGlitchMode is 1, apply segmented, flickery, theme-colored bands.
 *
 * Uniforms:
 *   tDiffuse: main scene texture
 *   time: animation time
 *   chromaStrength: base chromatic aberration strength
 *   gain: output gain
 *   segmentedGlitchMode: 0 = classic, 1 = segmented/flickery
 *   glitchIntensity: controls how strong the segmented effect is
 *   flickerRate: controls how fast bands flicker
 *   colorPopIntensity: how much theme color pops in
 *   themePrimary, themeAccent, themeSecondary: theme colors (vec3)
 */
export const finalPassFragmentShader = `
  // --- uniforms ---
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform float chromaStrength;
  uniform float gain;
  uniform float segmentedGlitchMode;
  uniform float glitchIntensity;
  uniform float flickerRate;
  uniform float colorPopIntensity;
  uniform float blockSize; // controls average block size (8-64)
  uniform float blockOnProbability; // probability a block is "on" (0.0-1.0, default 0.15)
  uniform float burstProbability; // probability of a global burst (0.0-1.0, default 0.03)
  uniform vec3 themePrimary;
  uniform vec3 themeAccent;
  uniform vec3 themeSecondary;
  varying vec2 vUv;

  // --- utility: hash functions for randomness ---
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
    // --- classic mode: subtle global chromatic aberration ---
    if (segmentedGlitchMode < 0.5) {
      float baseAberration = chromaStrength;
      float modulatedTime = mod(time, 10.0);
      float variation = sin(modulatedTime * 0.5) * 0.2;
      float displacement = clamp(baseAberration * (1.0 + variation), 0.0, chromaStrength * 1.5);

      // rgb split
      vec4 r = texture2D(tDiffuse, vUv + vec2(displacement, 0.0));
      vec4 g = texture2D(tDiffuse, vUv);
      vec4 b = texture2D(tDiffuse, vUv - vec2(displacement, 0.0));
      vec4 color = vec4(r.r, g.g, b.b, g.a);

      // vignette
      vec2 uv = vUv * (1.0 - vUv.yx);
      float vig = uv.x * uv.y * 15.0;
      vig = pow(vig, 0.25);
      color *= vec4(vig, vig, vig, 1.0);

      gl_FragColor = color * gain;
      return;
    }

    // --- segmented/flickery mode ---

    // block size and count (large, variable blocks)
    float minBlock = blockSize * 0.7;
    float maxBlock = blockSize * 1.3;
    float blockCountX = mix(8.0, 2.0, hash(time * 0.13)) + (32.0 / maxBlock);
    float blockCountY = mix(6.0, 2.0, hash(time * 0.23)) + (24.0 / maxBlock);
    vec2 block = floor(vUv * vec2(blockCountX, blockCountY));

    // block on/off animation (mostly off, animated by time)
    float blockAnimSeed = hash2(block + floor(time * flickerRate));
    float blockOn = step(1.0 - blockOnProbability, blockAnimSeed);

    // rare global burst (all blocks glitch at once)
    float burst = step(1.0 - burstProbability, hash(floor(time * 0.7)));

    // glitch intensity for this block (mix in burst)
    float localGlitch = glitchIntensity * blockOn;
    localGlitch = mix(localGlitch, glitchIntensity, burst);

    // block size irregularity
    float blockSizeJitter = mix(minBlock, maxBlock, hash2(block + 100.0));

    // rgb split displacement (more dramatic when glitched)
    float displacement = chromaStrength * (1.0 + localGlitch * (1.0 + hash2(block + 10.0)) * (blockSizeJitter / blockSize));

    // rgb split
    vec4 r = texture2D(tDiffuse, vUv + vec2(displacement, 0.0));
    vec4 g = texture2D(tDiffuse, vUv);
    vec4 b = texture2D(tDiffuse, vUv - vec2(displacement, 0.0));
    vec4 color = vec4(r.r, g.g, b.b, g.a);

    // theme color pop (rare, subtle, block-based)
    float colorPop = step(1.0 - colorPopIntensity * 0.5, hash2(block + 20.0));
    vec3 popColor = mix(themePrimary, themeAccent, hash2(block + 30.0));
    popColor = mix(popColor, themeSecondary, hash2(block + 40.0));
    color.rgb = mix(color.rgb, popColor, colorPop * 0.15 * colorPopIntensity);

    // vignette
    vec2 uv = vUv * (1.0 - vUv.yx);
    float vig = uv.x * uv.y * 15.0;
    vig = pow(vig, 0.25);
    color *= vec4(vig, vig, vig, 1.0);

    // output
    gl_FragColor = color * gain;
  }
`

// Factory function to create the electric shader material
export const createElectricShaderMaterial = (
  THREE: typeof Three,
  params: ShaderParams,
) => {
  const { texture, color, opacity, noiseScale, noiseOffset, isStencil } = params

  // Different material settings based on layer type
  if (isStencil) {
    // For stencil, use additive blending like other layers
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        color: { value: color },
        opacity: { value: opacity },
        time: { value: 0.0 },
        noiseScale: { value: noiseScale },
        noiseOffset: { value: noiseOffset },
        isStencil: { value: true },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false, // Don't write to depth buffer
      depthTest: true, // Do test against depth buffer
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  } else {
    // For electric outlines, use additive blending
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        color: { value: color },
        opacity: { value: opacity },
        time: { value: 0.0 },
        noiseScale: { value: noiseScale },
        noiseOffset: { value: noiseOffset },
        isStencil: { value: false },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false, // Disable depth writing for better blending
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  }
}
