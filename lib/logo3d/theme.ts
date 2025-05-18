/**
 * theme.ts - Color theming system for logo3d
 *
 * Provides a centralized theme system to manage all colors across the visualization
 */

import type { Color } from 'three'
import { CYBERPUNK_THEME } from './themes/cyberpunk.ts'
import { SYNTHWAVE_THEME } from './themes/synthwave.ts'
import { MONOCHROME_THEME } from './themes/monochrome.ts'
import { TECHSCAPE_THEME } from './themes/techscape.ts'

/**
 * RGB color with normalized values (0-1)
 */
export type RGBColor = {
  r: number
  g: number
  b: number
}

/**
 * Hex color as a number (e.g., 0xff0000)
 */
export type HexColor = number

/**
 * Main theme interface containing all color values
 */
export type Logo3DTheme = {
  // Primary colors
  primary: RGBColor
  secondary: RGBColor
  accent: RGBColor
  background: HexColor

  // Logo layers
  stencilColor: RGBColor
  baseLayerColor: RGBColor
  outlineColor: RGBColor
  ghostingColors: {
    cyan: RGBColor
    magenta: RGBColor
  }

  // UI overlay
  ui: {
    accentColor1: HexColor
    accentColor2: HexColor
    hexagonColor: HexColor
    centralCircleColor: HexColor
    centerCrosshairColor: HexColor
    gridColor: HexColor
  }

  // Geometric layer
  geometric: {
    primaryColor: HexColor
    secondaryColor: HexColor
  }

  // Lens flare
  lensFlare: {
    mainFlareColor: HexColor
    secondaryFlareColor: HexColor
    tertiaryFlareColor: HexColor
  }
}

// Current active theme
let currentTheme = TECHSCAPE_THEME

/**
 * Get the current active theme
 */
export const getCurrentTheme = (): Logo3DTheme => currentTheme

/**
 * Set the active theme
 */
export const setTheme = (theme: Logo3DTheme): void => {
  currentTheme = theme
}

/**
 * Convert a THREE.js Color to an RGB object
 */
export const colorToRGB = (color: Color): RGBColor => {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
  }
}

/**
 * Convert an RGB object to a hex color number
 */
export const rgbToHex = (rgb: RGBColor): HexColor => {
  const r = Math.floor(rgb.r * 255)
  const g = Math.floor(rgb.g * 255)
  const b = Math.floor(rgb.b * 255)

  return (r << 16) + (g << 8) + b
}

/**
 * Convert a hex color number to an RGB object
 */
export const hexToRGB = (hex: HexColor): RGBColor => {
  const r = ((hex >> 16) & 255) / 255
  const g = ((hex >> 8) & 255) / 255
  const b = (hex & 255) / 255

  return { r, g, b }
}

/**
 * Create a custom theme by extending an existing theme
 */
export const createCustomTheme = (baseTheme: Logo3DTheme, overrides: Partial<Logo3DTheme>): Logo3DTheme => {
  return {
    ...baseTheme,
    ...overrides,
    ui: {
      ...baseTheme.ui,
      ...(overrides.ui || {}),
    },
    geometric: {
      ...baseTheme.geometric,
      ...(overrides.geometric || {}),
    },
    lensFlare: {
      ...baseTheme.lensFlare,
      ...(overrides.lensFlare || {}),
    },
    ghostingColors: {
      ...baseTheme.ghostingColors,
      ...(overrides.ghostingColors || {}),
    },
  }
}

// Re-export all theme constants
export { CYBERPUNK_THEME, MONOCHROME_THEME, SYNTHWAVE_THEME, TECHSCAPE_THEME }
