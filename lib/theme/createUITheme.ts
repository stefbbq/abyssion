import type { BaseTheme } from './themes/types.ts'
import type { UITheme } from './types.ts'
import { hexToCSS } from './colorUtils/hexToCSS.ts'
import { rgbToCSS } from './colorUtils/rgbToCSS.ts'
import { hexStringToRGB } from './colorUtils/hexStringToRGB.ts'
import { numberToHexString } from './colorUtils/numberToHexString.ts'
import { resolveColorReference } from './utils/resolveColorReference.ts'
import { createDefaultSurfaces, createUISurfaces } from './utils/createUISurfaces.ts'
import { pipe } from '@lib/utils/pipe.ts'

/**
 * Default themed background opacity values
 */
const defaultBackgroundOpacity = {
  light: 0.7,
  dark: 0.6,
}

/**
 * Creates a UITheme from a BaseTheme with new semantic structure
 * Used for themes that have palette and colorRoles properties
 */
export const createUITheme = (baseTheme: BaseTheme): UITheme => {
  const isDarkMode = baseTheme.mode === 'dark'
  const { palette, colorRoles } = baseTheme

  if (!palette || !colorRoles) throw new Error('createUITheme requires BaseTheme with palette and colorRoles properties')

  // Create surfaces configuration
  const baseSurfaces = baseTheme.surfaces || createDefaultSurfaces()
  const surfaces = createUISurfaces(baseSurfaces, palette, colorRoles, baseTheme.mode)

  // Background opacity
  const backgroundOpacity = { ...defaultBackgroundOpacity, ...baseTheme.backgroundOpacity }

  // Resolve semantic color roles to actual colors
  const backgroundColors = {
    primary: hexToCSS(resolveColorReference(colorRoles.background.primary, palette, colorRoles)),
    secondary: hexToCSS(resolveColorReference(colorRoles.background.secondary, palette, colorRoles)),
    tertiary: hexToCSS(resolveColorReference(colorRoles.background.tertiary, palette, colorRoles)),
  }

  const textColors = {
    primary: pipe(
      resolveColorReference(colorRoles.text.primary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    secondary: pipe(
      resolveColorReference(colorRoles.text.secondary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    tertiary: pipe(
      resolveColorReference(colorRoles.text.tertiary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    inverse: hexToCSS(resolveColorReference(colorRoles.text.inverse, palette, colorRoles)),
  }

  const borderColors = {
    primary: hexToCSS(resolveColorReference(colorRoles.border.primary, palette, colorRoles)),
    secondary: hexToCSS(resolveColorReference(colorRoles.border.secondary, palette, colorRoles)),
    focus: pipe(
      resolveColorReference(colorRoles.interactive.primary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
  }

  const interactiveColors = {
    primary: pipe(
      resolveColorReference(colorRoles.interactive.primary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    primaryHover: pipe(
      resolveColorReference('primary.400', palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    secondary: pipe(
      resolveColorReference(colorRoles.interactive.secondary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    secondaryHover: pipe(
      resolveColorReference('secondary.400', palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      rgbToCSS,
    ),
    ghost: 'transparent',
    ghostHover: pipe(
      resolveColorReference(colorRoles.text.primary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      (rgb) => rgbToCSS(rgb, isDarkMode ? 0.1 : 0.05),
    ),
    ghostActive: pipe(
      resolveColorReference(colorRoles.text.primary, palette, colorRoles),
      numberToHexString,
      hexStringToRGB,
      (rgb) => rgbToCSS(rgb, isDarkMode ? 0.15 : 0.1),
    ),
  }

  return {
    colors: {
      background: backgroundColors,
      text: textColors,
      border: borderColors,
      interactive: interactiveColors,
    },
    surfaces,
    backgroundOpacity,
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: {
        heading: baseTheme?.typography?.fontFamily?.heading || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body: baseTheme?.typography?.fontFamily?.body || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        quote: baseTheme?.typography?.fontFamily?.quote || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      fontUrls: baseTheme?.typography?.fontUrls,
      fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    // Legacy glass/frost support for backward compatibility
    glass: {
      background: surfaces.main.background,
      backdrop: surfaces.main.backdropBlur || '16px',
      border: surfaces.main.border.width === '0px' ? '0px' : surfaces.main.border.color,
      opacity: surfaces.main.opacity,
    },
    frost: {
      background: surfaces.alt.background,
      backdrop: surfaces.alt.backdropBlur || '20px',
      border: surfaces.alt.border.width === '0px' ? '0px' : surfaces.alt.border.color,
      opacity: surfaces.alt.opacity,
    },
  }
}
