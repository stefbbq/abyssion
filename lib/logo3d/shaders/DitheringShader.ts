/**
 * DitheringShader.ts
 *
 * Dedicated shader for blue noise dithering to reduce banding artifacts
 * Applied as the final post-processing step
 */

// Vertex shader (pass-through)
export const ditheringVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader with blue noise dithering
export const ditheringFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform float ditherStrength;
  uniform float ditherFrequency;
  uniform float ditherAnimation;
  
  varying vec2 vUv;
  
  // Pseudo-random function for noise generation
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Blue noise dithering - higher quality noise pattern that's less visually distracting
  float blueNoise(vec2 uv, float time) {
    float noise = 0.0;
    
    // Multi-octave noise for better blue noise approximation
    float frequency = ditherFrequency;
    float amplitude = 0.5;
    
    // Layer 1 - high frequency
    vec2 seed1 = uv * frequency + vec2(time * ditherAnimation, time * ditherAnimation * 2.0);
    noise += (random(seed1) * 2.0 - 1.0) * amplitude;
    
    // Layer 2 - different frequency
    vec2 seed2 = uv * frequency * 1.7 + vec2(time * -ditherAnimation * 1.5, time * ditherAnimation);
    noise += (random(seed2) * 2.0 - 1.0) * amplitude * 0.5;
    
    // Layer 3 - very high frequency for fine details
    vec2 seed3 = uv * frequency * 3.1 + vec2(time * ditherAnimation * 0.7, time * -ditherAnimation * 0.3);
    noise += (random(seed3) * 2.0 - 1.0) * amplitude * 0.25;
    
    // Return normalized to 0-1 range
    return noise * 0.33 + 0.5;
  }
  
  void main() {
    // Get the color from the previous pass
    vec4 color = texture2D(tDiffuse, vUv);
    
    // Apply blue noise dithering to reduce banding
    // This adds subtle noise based on screen position, not texture coordinates
    float ditherNoise = blueNoise(gl_FragCoord.xy, time);
    
    // Apply the dithering - breaking up color bands
    // Multiple by ditherStrength to control intensity
    float ditherAmount = 1.0/255.0 * ditherStrength;
    vec3 dithered = color.rgb + (ditherNoise * 2.0 - 1.0) * ditherAmount;
    
    gl_FragColor = vec4(dithered, color.a);
  }
`
