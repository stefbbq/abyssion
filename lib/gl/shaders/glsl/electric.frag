// Electric outline and stencil effect with animated noise
// See: https://en.wikipedia.org/wiki/Simplex_noise
uniform sampler2D map;
uniform vec3 color;
uniform float opacity;
uniform float time;
uniform float noiseScale;
uniform float noiseOffset;
uniform bool isStencil;

varying vec2 vUv;

// Permutation for simplex noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

// 2D simplex noise for organic animation
// See: https://en.wikipedia.org/wiki/Simplex_noise
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

// Makes noise edges sharper for a more electric look
float sharpTransition(float value, float edge, float smoothness) {
  return smoothstep(edge - smoothness, edge + smoothness, value);
}

void main() {
  // Sample the input texture
  vec4 texColor = texture2D(map, vUv);

  // Animate noise with time
  float noise = snoise(vUv * noiseScale + time * 0.1) * 0.5 + 0.5;
  noise = sharpTransition(noise, noiseOffset, 0.1);

  // Flicker effect
  float flicker = sharpTransition(snoise(vec2(time * 0.2, 0.0)), 0.4, 0.1);
  noise *= mix(0.85, 1.0, flicker);

  // Stencil: solid, minimal noise. Outline: full effect
  if (isStencil) {
    float stencilNoise = mix(0.95, 1.0, noise); // subtle
    float alpha = texColor.a * stencilNoise * opacity;
    gl_FragColor = vec4(color * texColor.rgb, alpha);
  } else {
    float alpha = texColor.a * noise * opacity;
    gl_FragColor = vec4(color * texColor.rgb, alpha);
  }
} 