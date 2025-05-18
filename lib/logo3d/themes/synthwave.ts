/**
 * synthwave.ts - Synthwave theme for logo3d
 */

import type { Logo3DTheme } from '../theme.ts'

/**
 * Synthwave theme with purple and pink dominant colors
 */
export const SYNTHWAVE_THEME: Logo3DTheme = {
  primary: { r: 1, g: 1, b: 1 },
  secondary: { r: 0.8, g: 0.3, b: 1 },
  accent: { r: 1, g: 0.2, b: 0.6 },
  background: 0x000011,

  stencilColor: { r: 1, g: 1, b: 1 },
  baseLayerColor: { r: 1, g: 1, b: 1 },
  outlineColor: { r: 1, g: 1, b: 1 },
  ghostingColors: {
    cyan: { r: 0.4, g: 0.2, b: 1 },
    magenta: { r: 1, g: 0.2, b: 0.7 },
  },

  ui: {
    accentColor1: 0xff2288,
    accentColor2: 0x8822ff,
    hexagonColor: 0xffffff,
    centralCircleColor: 0xcc44ff,
    centerCrosshairColor: 0xffffff,
    gridColor: 0xff44cc,
  },

  geometric: {
    primaryColor: 0x9955ff,
    secondaryColor: 0xff55cc,
  },

  lensFlare: {
    mainFlareColor: 0xcc66ff,
    secondaryFlareColor: 0xff44aa,
    tertiaryFlareColor: 0x6644ff,
  },
}
