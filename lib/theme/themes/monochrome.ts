import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { hexStringToNumber } from '../colorUtils/hexStringToNumber.ts'

/**
 * Monochrome theme with white and gray tones - dark mode
 */
export const monochromeTheme = createBaseTheme({
  name: 'monochrome',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffffff'),
  secondary: hexStringToRGB('#cccccc'),
  accent: hexStringToRGB('#999999'),
  background: hexStringToNumber('#000000'),

  // Color variants
  primaryAlt: hexStringToRGB('#e6e6e6'),
  primaryDark: hexStringToRGB('#cccccc'),
  secondaryAlt: hexStringToRGB('#d9d9d9'),
  secondaryDark: hexStringToRGB('#999999'),
  accentAlt: hexStringToRGB('#b3b3b3'),
  accentDark: hexStringToRGB('#666666'),

  // Background variants
  backgroundAlt: hexStringToNumber('#111111'),
  backgroundDark: hexStringToNumber('#222222'),

  // Foreground colors
  foreground: hexStringToRGB('#ffffff'),
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

/**
 * Monochrome theme with black and gray tones - light mode
 */
export const monochromeLightTheme = createBaseTheme({
  name: 'monochrome-light',
  mode: 'light',

  // Inverted colors for light mode
  primary: hexStringToRGB('#000000'),
  secondary: hexStringToRGB('#333333'),
  accent: hexStringToRGB('#666666'),
  background: hexStringToNumber('#ffffff'),

  // Color variants
  primaryAlt: hexStringToRGB('#1a1a1a'),
  primaryDark: hexStringToRGB('#333333'),
  secondaryAlt: hexStringToRGB('#262626'),
  secondaryDark: hexStringToRGB('#666666'),
  accentAlt: hexStringToRGB('#4d4d4d'),
  accentDark: hexStringToRGB('#999999'),

  // Background variants
  backgroundAlt: hexStringToNumber('#f5f5f5'),
  backgroundDark: hexStringToNumber('#e6e6e6'),

  // Foreground colors
  foreground: hexStringToRGB('#000000'),
  foregroundAlt: hexStringToRGB('#333333'),
  foregroundLight: hexStringToRGB('#666666'),

  // Additional colors
  border: hexStringToNumber('#cccccc'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f9f9f9'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
