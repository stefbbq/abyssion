/**
 * techscape.ts - Techscape theme for logo3d
 */

import type { Logo3DTheme } from '../theme.ts'

/**
 * Techscape theme with teal and green topographic highlights
 */
export const TECHSCAPE_THEME: Logo3DTheme = {
  primary: { r: 1, g: 1, b: 1 },
  secondary: { r: 0, g: 0.8, b: 0.8 },
  accent: { r: 0.4, g: 0.9, b: 0.5 },
  background: 0x151515,

  stencilColor: { r: 1, g: 1, b: 1 },
  baseLayerColor: { r: 1, g: 1, b: 1 },
  outlineColor: { r: 1, g: 1, b: 1 },
  ghostingColors: {
    cyan: { r: 0, g: 0.8, b: 0.8 },
    magenta: { r: 0.4, g: 0.9, b: 0.5 },
  },

  ui: {
    accentColor1: 0x00dddd,
    accentColor2: 0x66ff99,
    hexagonColor: 0xffffff,
    centralCircleColor: 0x00cccc,
    centerCrosshairColor: 0xffffff,
    gridColor: 0x999999,
  },

  geometric: {
    primaryColor: 0x00cccc,
    secondaryColor: 0x77ff99,
  },

  lensFlare: {
    mainFlareColor: 0x00dddd,
    secondaryFlareColor: 0x00aaaa,
    tertiaryFlareColor: 0x66ff99,
  },
}
