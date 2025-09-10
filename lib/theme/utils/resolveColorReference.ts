import type { ColorPalette, HexColor } from '../types.ts'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Resolves a color reference string to the actual color value from the palette
 *
 * @param reference - Color reference string (e.g., 'primary.500', 'background.200')
 * @param palette - The color palette containing primitive colors
 * @returns The resolved hex color value
 *
 * @example
 * resolveColorReference('primary.500', palette) // Returns palette.primary[500]
 */
export const resolveColorReference = (
  reference: string,
  palette: ColorPalette | undefined,
): HexColor => {
  if (!palette) {
    console.warn(`Cannot resolve color reference "${reference}" - palette is undefined`)
    return 0x4263eb // fallback to a reasonable default color
  }

  // Handle direct palette references (e.g., 'primary.500', 'background.100')
  if (reference.includes('.')) {
    const [category, shade] = reference.split('.')
    if (category in palette) {
      const categoryColors = palette[category as keyof ColorPalette]
      if (typeof categoryColors === 'object' && shade in categoryColors) {
        return categoryColors[shade as keyof typeof categoryColors] as HexColor
      }
    }
  }

  // Handle single-level references (fallback)
  if (reference in palette) {
    const paletteEntry = palette[reference as keyof ColorPalette]
    if (typeof paletteEntry === 'number') {
      return paletteEntry as HexColor
    }
  }

  // If we can't resolve the reference, return a fallback instead of throwing
  log(
    lc.THEME,
    `Could not resolve color reference "${reference}". ` +
      `Valid formats: 'primary.500', 'background.200', etc. Using fallback color.`,
  )
  return 0x4263eb // fallback to a reasonable default color
}

/**
 * Batch resolves multiple color references
 *
 * @param references - Object with color reference strings as values
 * @param palette - The color palette
 * @returns Object with resolved hex color values
 */
export const resolveColorReferences = <T extends Record<string, string>>(
  references: T,
  palette: ColorPalette,
): Record<keyof T, HexColor> => {
  const resolved = {} as Record<keyof T, HexColor>
  for (const [key, reference] of Object.entries(references)) {
    resolved[key as keyof T] = resolveColorReference(reference, palette)
  }
  return resolved
}

/**
 * Creates a palette with shades from base colors
 * Used for backward compatibility with legacy themes
 */
export const createPaletteWithShades = (baseColors: {
  primary: number
  secondary: number
  accent: number
  neutral: number
}): ColorPalette => {
  const createShades = (baseColor: number) => {
    // Calculate various shades
    const r = (baseColor >> 16) & 0xFF
    const g = (baseColor >> 8) & 0xFF
    const b = baseColor & 0xFF

    const lighten = (factor: number) => {
      const newR = Math.round(r + (255 - r) * factor)
      const newG = Math.round(g + (255 - g) * factor)
      const newB = Math.round(b + (255 - b) * factor)
      return (newR << 16) | (newG << 8) | newB
    }

    const darken = (factor: number) => {
      const newR = Math.round(r * factor)
      const newG = Math.round(g * factor)
      const newB = Math.round(b * factor)
      return (newR << 16) | (newG << 8) | newB
    }

    return {
      50: lighten(0.9),
      100: lighten(0.8),
      200: lighten(0.6),
      300: lighten(0.4),
      400: lighten(0.2),
      500: baseColor,
      neutral: baseColor,
      600: darken(0.8),
      700: darken(0.6),
      800: darken(0.4),
      900: darken(0.2),
      950: darken(0.1),
      1000: darken(0.05),
    }
  }

  // Create neutral scale with all required shades
  const neutral = baseColors.neutral
  const neutralR = (neutral >> 16) & 0xFF
  const neutralG = (neutral >> 8) & 0xFF
  const neutralB = neutral & 0xFF

  const lightenNeutral = (factor: number) => {
    const newR = Math.round(neutralR + (255 - neutralR) * factor)
    const newG = Math.round(neutralG + (255 - neutralG) * factor)
    const newB = Math.round(neutralB + (255 - neutralB) * factor)
    return (newR << 16) | (newG << 8) | newB
  }

  const darkenNeutral = (factor: number) => {
    const newR = Math.round(neutralR * factor)
    const newG = Math.round(neutralG * factor)
    const newB = Math.round(neutralB * factor)
    return (newR << 16) | (newG << 8) | newB
  }

  const neutralShades = {
    50: lightenNeutral(0.95),
    100: lightenNeutral(0.85),
    200: lightenNeutral(0.7),
    300: lightenNeutral(0.5),
    400: lightenNeutral(0.3),
    500: neutral,
    neutral: neutral,
    600: darkenNeutral(0.8),
    700: darkenNeutral(0.6),
    800: darkenNeutral(0.4),
    900: darkenNeutral(0.2),
    950: darkenNeutral(0.1),
    1000: 0x000000,
  }

  return {
    primary: createShades(baseColors.primary),
    secondary: createShades(baseColors.secondary),
    tertiary: createShades(baseColors.accent),
    foreground: neutralShades,
    background: neutralShades,
    surface: neutralShades,
    semantic: {
      success: 0x10b981, // Green
      warning: 0xf59e0b, // Amber
      error: 0xef4444, // Red
      info: 0x3b82f6, // Blue
    },
  }
}
