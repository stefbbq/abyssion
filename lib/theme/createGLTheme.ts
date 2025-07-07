import type { BaseTheme, GLTheme } from './index.types.ts'
import { rgbToHex } from './colorUtils/rgbToHex.ts'
import { darkenHex } from './colorUtils/darkenHex.ts'
import { resolveColorReference } from './utils/resolveColorReference.ts'
import { hexStringToRGB } from './colorUtils/hexStringToRGB.ts'
import { createShades } from './colorUtils/createShades.ts'

/**
 * Creates a GLTheme object from a BaseTheme.
 * Always uses palette-based color lookup.
 * Used for theme-aware Three.js scenes.
 */
export const createGLTheme = (baseTheme: BaseTheme): GLTheme => {
  const isDarkMode = baseTheme.mode === 'dark'

  // Create full palette with shades (same as createUITheme)
  const fullPalette = {
    primary: createShades(baseTheme.palette.primary as number),
    secondary: createShades(baseTheme.palette.secondary as number),
    tertiary: createShades(baseTheme.palette.tertiary as number),
    foreground: createShades(baseTheme.palette.foreground as number),
    background: createShades(baseTheme.palette.background as number),
    surface: createShades(baseTheme.palette.surface as number),
    semantic: baseTheme.palette.semantic,
  }

  // Now use palette-based color lookup with proper shades
  const primaryHex = resolveColorReference('primary.500', fullPalette)
  const secondaryHex = resolveColorReference('secondary.500', fullPalette)
  const accentHex = resolveColorReference('tertiary.500', fullPalette)

  const primary = hexStringToRGB('#' + primaryHex.toString(16).padStart(6, '0'))
  const secondary = hexStringToRGB('#' + secondaryHex.toString(16).padStart(6, '0'))
  const accent = hexStringToRGB('#' + accentHex.toString(16).padStart(6, '0'))

  return {
    ...baseTheme,
    primary,
    secondary,
    accent,
    stencilColor: { r: 1, g: 1, b: 1 },
    baseLayerColor: isDarkMode ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 0.9, g: 0.9, b: 0.9 },
    outlineColor: { r: 1, g: 1, b: 1 },
    ghostingColors: {
      cyan: accent,
      magenta: secondary,
    },
    ui: {
      accentColor1: rgbToHex(secondary),
      accentColor2: rgbToHex(accent),
      hexagonColor: isDarkMode ? 0xffffff : 0x333333,
      centralCircleColor: rgbToHex(primary),
      centerCrosshairColor: isDarkMode ? 0xffffff : 0x000000,
      gridColor: isDarkMode ? 0x999999 : 0x666666,
    },
    geometric: {
      primaryColor: rgbToHex(primary),
      secondaryColor: rgbToHex(accent),
    },
    lensFlare: {
      mainFlareColor: rgbToHex(primary),
      secondaryFlareColor: darkenHex(rgbToHex(primary))(0.8),
      tertiaryFlareColor: rgbToHex(accent),
    },
  }
}
