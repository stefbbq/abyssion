import type { BaseTheme, UITheme } from './types.ts'
import { hexToCSS } from './utils/hexToCSS.ts'
import { rgbToCSS } from './utils/rgbToCSS.ts'
import { hexStringToRGB } from './utils/hexStringToRGB.ts'
import { pipe } from '@lib/utils/pipe.ts'

const numberToHexString = (num: number) => `#${num.toString(16).padStart(6, '0')}`

/**
 * Default border radius values
 */
const defaultBorderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
}

/**
 * Default glass opacity values
 */
const defaultGlassOpacity = {
  light: 0.4,
  dark: 0.5,
}

/**
 * Default frost opacity values
 */
const defaultFrostOpacity = {
  light: 0.9,
  dark: 0.85,
}

/**
 * Creates a UITheme object from a BaseTheme.
 * Handles all color, spacing, and typography logic for UI.
 * Used for generating CSS variables and theme-aware UI.
 */
export const createTheme = (baseTheme: BaseTheme): UITheme => {
  const isDarkMode = baseTheme.mode === 'dark'

  // Merge theme-specific values with defaults
  const borderRadius = { ...defaultBorderRadius, ...baseTheme.borderRadius }
  const glassOpacity = { ...defaultGlassOpacity, ...baseTheme.glassOpacity }
  const frostOpacity = { ...defaultFrostOpacity, ...baseTheme.frostOpacity }

  return {
    colors: {
      background: {
        primary: hexToCSS(baseTheme.background),
        secondary: hexToCSS(baseTheme.backgroundAlt),
        tertiary: hexToCSS(baseTheme.backgroundDark),
      },
      surface: {
        primary: hexToCSS(baseTheme.surface),
        secondary: hexToCSS(baseTheme.surfaceAlt),
        elevated: hexToCSS(baseTheme.backgroundDark),
      },
      text: {
        primary: rgbToCSS(baseTheme.foreground),
        secondary: rgbToCSS(baseTheme.foregroundAlt),
        tertiary: rgbToCSS(baseTheme.foregroundLight),
        inverse: hexToCSS(isDarkMode ? 0xffffff : baseTheme.background),
      },
      border: {
        primary: hexToCSS(baseTheme.border),
        secondary: rgbToCSS(baseTheme.foregroundLight, isDarkMode ? 0.3 : 0.2),
        focus: rgbToCSS(baseTheme.primary),
      },
      interactive: {
        primary: rgbToCSS(baseTheme.primary),
        primaryHover: rgbToCSS(baseTheme.primaryAlt),
        secondary: rgbToCSS(baseTheme.secondary),
        secondaryHover: rgbToCSS(baseTheme.secondaryAlt),
        ghost: 'transparent',
        ghostHover: rgbToCSS(baseTheme.foreground, isDarkMode ? 0.1 : 0.05),
        ghostActive: rgbToCSS(baseTheme.foreground, isDarkMode ? 0.15 : 0.1),
      },
    },
    glass: {
      background: pipe(
        baseTheme.surface,
        numberToHexString,
        hexStringToRGB,
        (rgb) => rgbToCSS(rgb, isDarkMode ? glassOpacity.dark : glassOpacity.light),
      ),
      backdrop: '16px',
      border: rgbToCSS(baseTheme.foreground, isDarkMode ? 0.08 : 0.1),
      opacity: glassOpacity,
    },
    frost: {
      background: pipe(
        baseTheme.backgroundAlt,
        numberToHexString,
        hexStringToRGB,
        (rgb) => rgbToCSS(rgb, isDarkMode ? frostOpacity.dark : frostOpacity.light),
      ),
      backdrop: '20px',
      border: '0px',
      opacity: frostOpacity,
    },
    borderRadius,
    filters: baseTheme.filters || {},
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
  }
}
