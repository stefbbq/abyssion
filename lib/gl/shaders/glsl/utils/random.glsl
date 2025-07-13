/**
 * Pseudo-random number generator - like Math.random() but deterministic
 * Takes a 2D coordinate and returns a "random" float between 0.0 and 1.0
 * Same input always gives same output (pure function)
 * Uses dot product + sine + fractional part for pseudo-randomness
 * 
 * @param {vec2} c - 2D coordinate input (like {x: number, y: number})
 * @returns {float} - Pseudo-random value between 0.0 and 1.0
 * 
 * @example
 * // Get random value for current pixel
 * float pixelRandom = random(vUv);
 * 
 * @example
 * // Get time-based random value
 * float timeRandom = random(vec2(time, time * 2.0));
 * 
 * @example
 * // Get spatial random with time variation
 * float animatedRandom = random(vUv + time);
 */
float random(vec2 c) {
    return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
} 