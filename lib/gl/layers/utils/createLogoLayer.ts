import type { LogoLayer } from '@libgl/layers/LogoLayer.ts'
import { randomLayerConfig } from '@libgl/layers/config.ts'
import { FPS_OPTIONS } from '@libgl/layers/constants.ts'
import { getRandomColor } from './getRandomColor.ts'
import { getCurrentTheme } from '@libgl/theme/theme.ts'

/**
 * Generate a random layer with position based on index
 */
export const createLogoLayer = (
  THREE: typeof import('three'),
): LogoLayer => {
  const {
    cyanProbability,
    magentaProbability,
    zBaseRange,
    zVarianceBase,
    opacityBase,
    noiseScaleBase,
    frontBias,
  } = randomLayerConfig

  const theme = getCurrentTheme()

  // decide if this should be a cyan-ish, magenta-ish, or white-ish layer
  const colorType = Math.random()
  let color: any

  if (colorType < cyanProbability) {
    // cyan range from theme
    color = getRandomColor(THREE, theme.ghostingColors.cyan)
  } else if (colorType < cyanProbability + magentaProbability) {
    // magenta range from theme
    color = getRandomColor(THREE, theme.ghostingColors.magenta)
  } else {
    // white-ish (desaturated) from theme
    color = getRandomColor(THREE, theme.primary, 0.1)
  }

  // decide if this layer should be in front or behind based on frontBias
  const inFront = Math.random() < frontBias

  // z-position calculation with front/behind bias
  let zPos
  if (inFront) {
    // positive z = in front, with smaller range for tighter spacing
    zPos = zBaseRange * (Math.random() * 0.8 + 0.2) // 0.2 to 1.0 * zBaseRange
  } else {
    // negative z = behind, with smaller range for tighter spacing
    zPos = -zBaseRange * (Math.random() * 0.8 + 0.2) // -0.2 to -1.0 * zBaseRange
  }

  // add small variance to z position
  zPos += Math.random() * zVarianceBase - zVarianceBase / 2

  // opacity decreases with distance from center
  const distanceFactor = Math.abs(zPos) * 2
  const maxOpacity = 0.5 * Math.max(0.05, 1 - distanceFactor)
  const opacity = opacityBase + Math.random() * maxOpacity

  // noise: scale increases with distance (more chaotic in background)
  const noiseScale = noiseScaleBase + Math.random() * 9 + Math.abs(zPos) * 10

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
