// Dependencies
#pragma include "random.glsl"

/**
 * Random value within a specific range
 * Takes a 2D coordinate and returns a random value between min and max
 * 
 * @param {vec2} c - 2D coordinate input for seed
 * @param {float} minVal - Minimum value of range
 * @param {float} maxVal - Maximum value of range
 * @returns {float} - Random value between minVal and maxVal
 * 
 * @example
 * // Get random value between -1.0 and 1.0
 * float noise = randomRange(vUv + time, -1.0, 1.0);
 * 
 * @example
 * // Get random opacity between 0.5 and 1.0
 * float alpha = randomRange(vUv, 0.5, 1.0);
 */
float randomRange(vec2 c, float minVal, float maxVal) {
    return minVal + random(c) * (maxVal - minVal);
} 