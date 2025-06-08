/**
 * GL theme system exports
 * Provides 3D rendering specific theme functionality
 */

import { getCurrentBaseTheme } from '@libtheme/index.ts'
import type { BaseTheme } from '@libtheme/types.ts'
import type { GLTheme } from './types.ts'
import { rgbToHex } from '@libtheme/utils/rgbToHex.ts'
import { darkenHex } from '@libtheme/utils/darkenHex.ts'

/**
 * Create GL theme from base theme with 3D rendering extensions
 * GL themes use vibrant colors optimized for 3D rendering regardless of UI mode
 * Pure function that builds a complete GL theme object
 */
export const createGLTheme = (baseTheme: BaseTheme): GLTheme => {
  const isDarkMode = baseTheme.mode === 'dark'

  return {
    ...baseTheme,

    // Logo layers - always use high contrast for 3D visibility
    stencilColor: { r: 1, g: 1, b: 1 },
    baseLayerColor: isDarkMode
      ? { r: 0.1, g: 0.1, b: 0.1 } // Dark base for dark mode
      : { r: 0.9, g: 0.9, b: 0.9 }, // Light base for light mode
    outlineColor: { r: 1, g: 1, b: 1 },
    ghostingColors: {
      cyan: baseTheme.accent, // Use theme accent for consistency
      magenta: baseTheme.secondary, // Use theme secondary
    },

    // UI overlays - adapt to mode but keep visibility
    ui: {
      accentColor1: rgbToHex(baseTheme.secondary),
      accentColor2: rgbToHex(baseTheme.accent),
      hexagonColor: isDarkMode ? 0xffffff : 0x333333,
      centralCircleColor: rgbToHex(baseTheme.primary),
      centerCrosshairColor: isDarkMode ? 0xffffff : 0x000000,
      gridColor: isDarkMode ? 0x999999 : 0x666666,
    },

    // Geometric elements - always vibrant for 3D depth
    geometric: {
      primaryColor: rgbToHex(baseTheme.primary),
      secondaryColor: rgbToHex(baseTheme.accent),
    },

    // Lens flare - always bright and atmospheric
    lensFlare: {
      mainFlareColor: rgbToHex(baseTheme.primary),
      secondaryFlareColor: darkenHex(rgbToHex(baseTheme.primary))(0.8),
      tertiaryFlareColor: rgbToHex(baseTheme.accent),
    },
  }
}

/**
 * Get current GL theme based on current theme mode
 */
export const getGLTheme = (): GLTheme => createGLTheme(getCurrentBaseTheme())

export type { GLTheme } from './types.ts'
