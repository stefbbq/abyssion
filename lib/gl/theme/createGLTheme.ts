import type { BaseTheme } from '@libtheme/types.ts'
import type { GLTheme } from './types.ts'
import { rgbToHex } from '@libtheme/utils/rgbToHex.ts'
import { darkenHex } from '@libtheme/utils/darkenHex.ts'

/**
 * Create GL theme from base theme with 3D rendering extensions
 * Pure function that builds a complete GL theme object
 */
export const createGLTheme = (baseTheme: BaseTheme): GLTheme => ({
  ...baseTheme,

  // logo layers default to white stencil system
  stencilColor: { r: 1, g: 1, b: 1 },
  baseLayerColor: { r: 1, g: 1, b: 1 },
  outlineColor: { r: 1, g: 1, b: 1 },
  ghostingColors: {
    cyan: baseTheme.secondary,
    magenta: baseTheme.accent,
  },

  // ui defaults derived from core colors
  ui: {
    accentColor1: rgbToHex(baseTheme.secondary),
    accentColor2: rgbToHex(baseTheme.accent),
    hexagonColor: 0xffffff,
    centralCircleColor: rgbToHex(baseTheme.secondary),
    centerCrosshairColor: 0xffffff,
    gridColor: 0x999999,
  },

  // geometric defaults
  geometric: {
    primaryColor: rgbToHex(baseTheme.secondary),
    secondaryColor: rgbToHex(baseTheme.accent),
  },

  // lens flare defaults
  lensFlare: {
    mainFlareColor: rgbToHex(baseTheme.secondary),
    secondaryFlareColor: darkenHex(rgbToHex(baseTheme.secondary))(0.8),
    tertiaryFlareColor: rgbToHex(baseTheme.accent),
  },
})
