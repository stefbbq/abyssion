// shared gl constants

// global fade thresholds used across animations for scroll-based fading
export const GLOBAL_FADE_START_THRESHOLD = 0.65
export const GLOBAL_FADE_END_THRESHOLD = 0.8

// fps options for random layer animation
export const FPS_OPTIONS = [1, 2, 4, 8, 12, 24, 48]

// platform and device
export const MOBILE_BREAKPOINT_PX = 768
export const IOS_MAX_DPR = 1.5

// scroll corruption intensity curve exponent (sqrt = 0.5)
export const CORRUPTION_INTENSITY_EXPONENT = 0.5

// pixelation effect bounds
export const PIXELATION_BASE_SIZE = 16
export const PIXELATION_MAX_SIZE = 64

// final pass chromatic aberration bounds
export const FINAL_PASS_CHROMA_BASE = 0.002
export const FINAL_PASS_CHROMA_MAX = 0.02

// white noise jitter controls
export const WHITE_NOISE_JITTER_STEP = 0.05
export const WHITE_NOISE_JITTER_MODULO = 7

// wave noise modulation range
export const WAVE_NOISE_MIN_SCALE = 0.9
export const WAVE_NOISE_RANGE = 0.2

// dithering intensity controls
export const DITHERING_BASE_INTENSITY = 0.8
export const DITHERING_VELOCITY_MULTIPLIER = 0.0001
export const DITHERING_VELOCITY_MAX = 2.0

// mobile scale factor for UI/shape adjustments
export const MOBILE_SCALE_FACTOR = 0.8
