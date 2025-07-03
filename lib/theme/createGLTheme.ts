import type { BaseTheme, GLTheme, RGBColor } from './types.ts'
import { rgbToHex } from './colorUtils/rgbToHex.ts'
import { darkenHex } from './colorUtils/darkenHex.ts'
import { resolveColorReference } from './utils/resolveColorReference.ts'
import { hexStringToRGB } from './colorUtils/hexStringToRGB.ts'

/**
 * Extracts RGB colors from a BaseTheme, handling both new and legacy structures
 */
const extractThemeColors = (baseTheme: BaseTheme): {
  primary: RGBColor
  secondary: RGBColor
  accent: RGBColor
} => {
  // Check if this theme has the new palette structure
  const hasNewStructure = baseTheme.palette && baseTheme.colorRoles

  if (hasNewStructure) {
    // Use new palette structure
    const primaryHex = resolveColorReference('primary.500', baseTheme.palette, baseTheme.colorRoles)
    const secondaryHex = resolveColorReference('secondary.500', baseTheme.palette, baseTheme.colorRoles)
    const accentHex = resolveColorReference('accent.500', baseTheme.palette, baseTheme.colorRoles)

    // Convert hex to RGB for rgbToHex function
    return {
      primary: hexStringToRGB('#' + primaryHex.toString(16).padStart(6, '0')),
      secondary: hexStringToRGB('#' + secondaryHex.toString(16).padStart(6, '0')),
      accent: hexStringToRGB('#' + accentHex.toString(16).padStart(6, '0')),
    }
  } else {
    // Use legacy theme structure with fallbacks
    return {
      primary: baseTheme.primary || { r: 0.26, g: 0.39, b: 0.92 }, // fallback to electric blue
      secondary: baseTheme.secondary || { r: 0.49, g: 0.23, b: 0.93 }, // fallback to purple
      accent: baseTheme.accent || { r: 0, g: 1, b: 0.88 }, // fallback to cyan
    }
  }
}

/**
 * Creates UI overlay colors for GL scenes
 */
const createUIColors = (colors: { primary: RGBColor; secondary: RGBColor; accent: RGBColor }, isDarkMode: boolean) => ({
  accentColor1: rgbToHex(colors.secondary),
  accentColor2: rgbToHex(colors.accent),
  hexagonColor: isDarkMode ? 0xffffff : 0x333333,
  centralCircleColor: rgbToHex(colors.primary),
  centerCrosshairColor: isDarkMode ? 0xffffff : 0x000000,
  gridColor: isDarkMode ? 0x999999 : 0x666666,
})

/**
 * Creates geometric element colors for GL scenes
 */
const createGeometricColors = (colors: { primary: RGBColor; accent: RGBColor }) => ({
  primaryColor: rgbToHex(colors.primary),
  secondaryColor: rgbToHex(colors.accent),
})

/**
 * Creates lens flare effect colors for GL scenes
 */
const createLensFlareColors = (colors: { primary: RGBColor; accent: RGBColor }) => ({
  mainFlareColor: rgbToHex(colors.primary),
  secondaryFlareColor: darkenHex(rgbToHex(colors.primary))(0.8),
  tertiaryFlareColor: rgbToHex(colors.accent),
})

/**
 * Creates base rendering layer colors
 */
const createBaseLayerColors = (isDarkMode: boolean) => ({
  stencilColor: { r: 1, g: 1, b: 1 } as RGBColor,
  baseLayerColor: isDarkMode ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 0.9, g: 0.9, b: 0.9 } as RGBColor,
  outlineColor: { r: 1, g: 1, b: 1 } as RGBColor,
})

/**
 * Creates a GLTheme object from a BaseTheme.
 * Adds all 3D/GL-specific color fields for overlays, geometry, and post-processing.
 * Used for theme-aware Three.js scenes.
 */
export const createGLTheme = (baseTheme: BaseTheme): GLTheme => {
  const isDarkMode = baseTheme.mode === 'dark'

  // Extract colors from theme (handles both new and legacy structures)
  const colors = extractThemeColors(baseTheme)

  // Create specialized color groups
  const baseColors = createBaseLayerColors(isDarkMode)
  const uiColors = createUIColors(colors, isDarkMode)
  const geometricColors = createGeometricColors(colors)
  const lensFlareColors = createLensFlareColors(colors)

  return {
    ...baseTheme,
    // Ensure GLTheme always has these RGB color properties
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    // Base rendering layers
    ...baseColors,
    // Ghosting effect colors for depth and dimension
    ghostingColors: {
      cyan: colors.accent,
      magenta: colors.secondary,
    },
    // UI overlay elements
    ui: uiColors,
    // Geometric decoration layers
    geometric: geometricColors,
    // Lens flare effects
    lensFlare: lensFlareColors,
  }
}
