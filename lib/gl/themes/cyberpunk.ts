/**
 * cyberpunk.ts - Cyberpunk theme for logo3d
 */

import type { Logo3DTheme } from '../theme.ts'

/**
 * Default cyberpunk theme colors
 */
export const CYBERPUNK_THEME: Logo3DTheme = {
  primary: { r: 1, g: 1, b: 1 },
  secondary: { r: 0.53, g: 1, b: 1 },
  accent: { r: 1, g: 0.53, b: 1 },
  background: 0x000000,
  stencilColor: { r: 1, g: 1, b: 1 },
  baseLayerColor: { r: 1, g: 1, b: 1 },
  outlineColor: { r: 1, g: 1, b: 1 },
  ghostingColors: {
    cyan: { r: 0.53, g: 1, b: 1 },
    magenta: { r: 1, g: 0.53, b: 1 },
  },

  ui: {
    accentColor1: 0xff4466,
    accentColor2: 0x44bbff,
    hexagonColor: 0xffffff,
    centralCircleColor: 0x88ccff,
    centerCrosshairColor: 0xffffff,
    gridColor: 0xffffff,
  },

  geometric: {
    primaryColor: 0xaad6ff,
    secondaryColor: 0xffaad0,
  },

  lensFlare: {
    mainFlareColor: 0x88ccff,
    secondaryFlareColor: 0x4499ff,
    tertiaryFlareColor: 0xffaacc,
  },
}
