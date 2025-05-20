/**
 * Animation timing and visual effect parameters
 */
export const ANIMATION_CONFIG = {
  // Time increment for animation
  TIME_INCREMENT: 0.01,

  // Chromatic aberration parameters
  CHROMA_GLITCH_PROBABILITY: 0.002,
  CHROMA_GLITCH_INTENSITY_MIN: 2,
  CHROMA_GLITCH_INTENSITY_MAX: 5,
  CHROMA_GLITCH_RESET_DELAY: 120,

  // Bloom parameters
  BLOOM_PULSE_FREQUENCY: 0.8,
  BLOOM_PULSE_INTENSITY: 0.15,
  BLOOM_STRENGTH: 0.15,
  BLOOM_OVERRIDE_PROBABILITY: 0.002, // Chance per frame to trigger override
  BLOOM_OVERRIDE_INTENSITY: 2.0, // Multiplier for how extreme the override is
  BLOOM_OVERRIDE_DURATION_MIN: 150,
  BLOOM_OVERRIDE_DURATION_MAX: 600,
}

export const USER_REACTIVITY = {
  MOUSE_COEFFICIENT: 0.02,
}
