import type { BaseTheme, GLTheme } from './types.ts'
import { rgbToHex } from './utils/rgbToHex.ts'
import { darkenHex } from './utils/darkenHex.ts'

/**
 * Creates a GLTheme object from a BaseTheme.
 * Adds all 3D/GL-specific color fields for overlays, geometry, and post-processing.
 * Used for theme-aware Three.js scenes.
 */
export const createGLTheme = (baseTheme: BaseTheme): GLTheme => {
  const isDarkMode = baseTheme.mode === 'dark'

  return {
    ...baseTheme,
    stencilColor: { r: 1, g: 1, b: 1 },
    baseLayerColor: isDarkMode ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 0.9, g: 0.9, b: 0.9 },
    outlineColor: { r: 1, g: 1, b: 1 },
    ghostingColors: {
      cyan: baseTheme.accent,
      magenta: baseTheme.secondary,
    },
    ui: {
      accentColor1: rgbToHex(baseTheme.secondary),
      accentColor2: rgbToHex(baseTheme.accent),
      hexagonColor: isDarkMode ? 0xffffff : 0x333333,
      centralCircleColor: rgbToHex(baseTheme.primary),
      centerCrosshairColor: isDarkMode ? 0xffffff : 0x000000,
      gridColor: isDarkMode ? 0x999999 : 0x666666,
    },
    geometric: {
      primaryColor: rgbToHex(baseTheme.primary),
      secondaryColor: rgbToHex(baseTheme.accent),
    },
    lensFlare: {
      mainFlareColor: rgbToHex(baseTheme.primary),
      secondaryFlareColor: darkenHex(rgbToHex(baseTheme.primary))(0.8),
      tertiaryFlareColor: rgbToHex(baseTheme.accent),
    },
  }
}
