/**
 * Scene configuration for 3D logo rendering
 */

import type { BloomParams } from '../types.ts'
import { getCurrentTheme } from '../theme.ts'

/** Aspect ratio of the logo (width/height) */
export const LOGO_ASPECT_RATIO = 1400 / 896

/** Base plane width in world units */
export const PLANE_WIDTH = 8

/** Base plane height in world units, calculated from aspect ratio */
export const PLANE_HEIGHT = PLANE_WIDTH / LOGO_ASPECT_RATIO

/** Default bloom effect parameters */
export const DEFAULT_BLOOM_PARAMS: BloomParams = {
  exposure: 1,
  bloomStrength: .3,
  bloomThreshold: 0.2,
  bloomRadius: 0.8,
}

/** WebGL renderer configuration */
export const RENDERER_CONFIG = {
  pixelRatioMultiplier: 1.5,
  pixelRatioMax: 2.5,
  antialias: true,
  alpha: true,
}

/** Video background configuration */
export const VIDEO_BACKGROUND_CONFIG = {
  enabled: true,
  position: {
    z: -500, // Far behind other elements
    scale: 1050, // Increased scale to fill more of the background
  },
  cycling: {
    minDuration: 0.5, // Minimum time (seconds) before switching to next video
    maxDuration: 2.0, // Maximum time (seconds) before switching to next video
    randomStart: true, // Start videos at random positions
  },
  appearance: {
    opacity: 0.4, // Opacity of the video (0-1)
  },
  videos: {
    path: 'static/videos/', // Path to videos directory (without leading slash)
    extensions: ['.mp4', '.webm', '.mov'], // Supported video extensions
  },
}

/** Post-processing effect parameters */
export const POST_PROCESSING_CONFIG = {
  film: {
    noiseIntensity: 0.05,
    scanlineIntensity: 5,
    scanlineCount: 2000,
    grayscale: false,
  },
  finalPass: {
    chromaStrength: 0.002,
    ditherStrength: 10, // Controls dithering intensity (multiplier for 1/255)
    ditherFrequency: 1000.0, // Controls noise pattern frequency
    ditherAnimation: 0.1, // Controls how quickly dither pattern changes with time
  },
  sharpening: {
    strength: 1, // Strength of the sharpening effect (0-1)
    enabled: true, // Whether sharpening is enabled
  },
}

// Helper to get theme-based lens flare config
const getThemeBasedLensFlareConfig = () => {
  const theme = getCurrentTheme()

  return {
    lightIntensity: 0.8,
    lightDistance: 100,
    lightPosition: [5, 5, 15],
    mainFlare: {
      size: 500,
      colorHex: theme.lensFlare.mainFlareColor,
      intensity: 0.5,
    },
    secondaryFlare: {
      size: 100,
      colorHex: theme.lensFlare.secondaryFlareColor,
      intensity: 0.3,
      position: 0.2,
    },
    tertiaryFlare: {
      size: 50,
      colorHex: theme.lensFlare.tertiaryFlareColor,
      intensity: 0.2,
      position: 0.6,
    },
  }
}

/** Lens flare effect configuration */
export const LENS_FLARE_CONFIG = getThemeBasedLensFlareConfig()

/** Camera positioning and rendering parameters */
export const CAMERA_CONFIG = {
  fov: 60,
  near: 0.1,
  far: 1000,
  position: {
    x: 0,
    y: 0,
    z: 5,
  },
}
