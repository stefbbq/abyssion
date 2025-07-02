import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Neon Grid OS theme - light theme with pink/red primary
 */
export const neonGridOSTheme = createBaseTheme({
  name: 'neon-grid-os',
  mode: 'light',

  // Original colors
  primary: hexStringToRGB('#ff2d55'),
  secondary: hexStringToRGB('#ff5e3a'),
  accent: hexStringToRGB('#bd10e0'),
  background: hexStringToNumber('#f8f8f8'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff456e'),
  primaryDark: hexStringToRGB('#cc0033'),
  secondaryAlt: hexStringToRGB('#ff7755'),
  secondaryDark: hexStringToRGB('#cc3a1e'),
  accentAlt: hexStringToRGB('#d040f2'),
  accentDark: hexStringToRGB('#8800aa'),

  // Background variants
  backgroundAlt: hexStringToNumber('#e5e5e5'),
  backgroundDark: hexStringToNumber('#cccccc'),

  // Foreground colors
  foreground: hexStringToRGB('#1a1a1a'),
  foregroundAlt: hexStringToRGB('#3a3a3a'),
  foregroundLight: hexStringToRGB('#666666'),

  // Additional colors
  border: hexStringToNumber('#d8d8d8'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f2f2f2'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})

/**
 * Neon Grid OS theme - dark theme with pink/red primary
 */
export const neonGridOSDarkTheme = createBaseTheme({
  name: 'neon-grid-os-dark',
  mode: 'dark',

  // Adapted colors for dark mode
  primary: hexStringToRGB('#ff456e'),
  secondary: hexStringToRGB('#ff7755'),
  accent: hexStringToRGB('#d040f2'),
  background: hexStringToNumber('#0a0a0a'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff6b85'),
  primaryDark: hexStringToRGB('#cc1a4d'),
  secondaryAlt: hexStringToRGB('#ff9977'),
  secondaryDark: hexStringToRGB('#cc4d2e'),
  accentAlt: hexStringToRGB('#e066ff'),
  accentDark: hexStringToRGB('#a000cc'),

  // Background variants
  backgroundAlt: hexStringToNumber('#151515'),
  backgroundDark: hexStringToNumber('#222222'),

  // Foreground colors
  foreground: hexStringToRGB('#f0f0f0'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#333333'),
  surface: hexStringToNumber('#1a1a1a'),
  surfaceAlt: hexStringToNumber('#222222'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
