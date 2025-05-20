import { LogoLayer } from '../LogoLayer.ts'
import { RANDOM_LAYER_CONFIG } from '../config.ts'
import { FPS_OPTIONS } from '../constants.ts'
import { getRandomColor } from './getRandomColor.ts'
import { getCurrentTheme } from '../../theme.ts'

/**
 * Generate a random layer with position based on index
 */
export const createLogoLayer = (
  index: number,
  totalRandom: number,
  THREE: any,
): LogoLayer => {
  const {
    CYAN_PROBABILITY,
    MAGENTA_PROBABILITY,
    Z_BASE_RANGE,
    Z_VARIANCE_BASE,
    OPACITY_BASE,
    NOISE_SCALE_BASE,
    FRONT_BIAS,
  } = RANDOM_LAYER_CONFIG

  const theme = getCurrentTheme()

  // Decide if this should be a cyan-ish, magenta-ish, or white-ish layer
  const colorType = Math.random()
  let color: any

  if (colorType < CYAN_PROBABILITY) {
    // Cyan range from theme
    color = getRandomColor(THREE, theme.ghostingColors.cyan)
  } else if (colorType < CYAN_PROBABILITY + MAGENTA_PROBABILITY) {
    // Magenta range from theme
    color = getRandomColor(THREE, theme.ghostingColors.magenta)
  } else {
    // White-ish (desaturated) from theme
    color = getRandomColor(THREE, theme.primary, 0.1)
  }

  // Decide if this layer should be in front or behind based on FRONT_BIAS
  const inFront = Math.random() < FRONT_BIAS

  // z-position calculation with front/behind bias
  let zPos
  if (inFront) {
    // Positive z = in front, with smaller range for tighter spacing
    zPos = Z_BASE_RANGE * (Math.random() * 0.8 + 0.2) // 0.2 to 1.0 * Z_BASE_RANGE
  } else {
    // Negative z = behind, with smaller range for tighter spacing
    zPos = -Z_BASE_RANGE * (Math.random() * 0.8 + 0.2) // -0.2 to -1.0 * Z_BASE_RANGE
  }

  // Add small variance to z position
  zPos += Math.random() * Z_VARIANCE_BASE - Z_VARIANCE_BASE / 2

  // Opacity decreases with distance from center
  const distanceFactor = Math.abs(zPos) * 2
  const maxOpacity = 0.5 * Math.max(0.05, 1 - distanceFactor)
  const opacity = OPACITY_BASE + Math.random() * maxOpacity

  // Noise parameters
  // Scale increases with distance (more chaotic in background)
  const noiseScale = NOISE_SCALE_BASE + Math.random() * 9 + Math.abs(zPos) * 10

  // Random fps from predefined options
  const fps = FPS_OPTIONS[Math.floor(Math.random() * FPS_OPTIONS.length)]

  return {
    isStencil: false,
    color,
    opacity,
    zPos,
    noiseScale,
    noiseOffset: Math.random() * 5,
    noiseRate: Math.random() * 2,
    fps,
    isRandom: true,
  }
}
