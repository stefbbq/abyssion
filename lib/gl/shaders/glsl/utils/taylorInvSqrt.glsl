// taylorInvSqrt.glsl
// Taylor inverse square root approximation for performance optimization
// Used in noise generation algorithms

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 taylorInvSqrt(vec3 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 taylorInvSqrt(vec2 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
