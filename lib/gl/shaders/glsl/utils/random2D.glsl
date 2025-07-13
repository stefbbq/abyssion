// Dependencies
#pragma include "random.glsl"

/**
 * 2D Random Vector - generates random direction
 * Returns a normalized 2D vector with random direction
 * 
 * @param {vec2} c - 2D coordinate input for seed
 * @returns {vec2} - Random unit vector (normalized)
 * 
 * @example
 * // Get random direction for particle movement
 * vec2 randomDir = random2D(vUv + time);
 * 
 * @example
 * // Get random offset for screen shake
 * vec2 shake = random2D(vec2(time)) * shakeAmount;
 */
vec2 random2D(vec2 c) {
    float angle = random(c) * 6.28318530718; // 2 * PI
    return vec2(cos(angle), sin(angle));
} 