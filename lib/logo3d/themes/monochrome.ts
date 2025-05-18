/**
 * monochrome.ts - Monochrome theme for logo3d
 */

import type { Logo3DTheme } from '../theme.ts'

/**
 * Monochrome theme with white and gray tones
 */
export const MONOCHROME_THEME: Logo3DTheme = {
  primary: { r: 1, g: 1, b: 1 },
  secondary: { r: 0.8, g: 0.8, b: 0.8 },
  accent: { r: 0.6, g: 0.6, b: 0.6 },
  background: 0x000000,

  stencilColor: { r: 1, g: 1, b: 1 },
  baseLayerColor: { r: 1, g: 1, b: 1 },
  outlineColor: { r: 0.9, g: 0.9, b: 0.9 },
  ghostingColors: {
    cyan: { r: 0.7, g: 0.7, b: 0.7 },
    magenta: { r: 0.5, g: 0.5, b: 0.5 },
  },

  ui: {
    accentColor1: 0xcccccc,
    accentColor2: 0xaaaaaa,
    hexagonColor: 0xffffff,
    centralCircleColor: 0xdddddd,
    centerCrosshairColor: 0xffffff,
    gridColor: 0xbbbbbb,
  },

  geometric: {
    primaryColor: 0xcccccc,
    secondaryColor: 0xaaaaaa,
  },

  lensFlare: {
    mainFlareColor: 0xffffff,
    secondaryFlareColor: 0xdddddd,
    tertiaryFlareColor: 0xbbbbbb,
  },
}
