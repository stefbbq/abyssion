import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Cyberpunk theme with cyan and magenta accents - dark mode
 */
export const cyberpunkTheme = createBaseTheme({
  name: 'cyberpunk',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffffff'),
  secondary: hexStringToRGB('#87ffff'),
  accent: hexStringToRGB('#ff87ff'),
  background: hexStringToNumber('#000000'),

  // Color variants
  primaryAlt: hexStringToRGB('#e6e6e6'),
  primaryDark: hexStringToRGB('#cccccc'),
  secondaryAlt: hexStringToRGB('#a6ffff'),
  secondaryDark: hexStringToRGB('#66cccc'),
  accentAlt: hexStringToRGB('#ffa6ff'),
  accentDark: hexStringToRGB('#cc66cc'),

  // Background variants
  backgroundAlt: hexStringToNumber('#0d0d0d'),
  backgroundDark: hexStringToNumber('#1a1a1a'),

  // Foreground colors
  foreground: hexStringToRGB('#ffffff'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#2a2a2a'),
  surface: hexStringToNumber('#161616'),
  surfaceAlt: hexStringToNumber('#1a1a1a'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})

/**
 * Cyberpunk theme with cyan and magenta accents - light mode
 */
export const cyberpunkLightTheme = createBaseTheme({
  name: 'cyberpunk-light',
  mode: 'light',

  // Same accent colors work in light mode
  primary: hexStringToRGB('#001a1a'),
  secondary: hexStringToRGB('#0066cc'),
  accent: hexStringToRGB('#cc0099'),
  background: hexStringToNumber('#f8f9fa'),

  // Color variants
  primaryAlt: hexStringToRGB('#003333'),
  primaryDark: hexStringToRGB('#000000'),
  secondaryAlt: hexStringToRGB('#3385d6'),
  secondaryDark: hexStringToRGB('#004d99'),
  accentAlt: hexStringToRGB('#d633a6'),
  accentDark: hexStringToRGB('#990066'),

  // Background variants
  backgroundAlt: hexStringToNumber('#e9ecef'),
  backgroundDark: hexStringToNumber('#dee2e6'),

  // Foreground colors
  foreground: hexStringToRGB('#000000'),
  foregroundAlt: hexStringToRGB('#333333'),
  foregroundLight: hexStringToRGB('#666666'),

  // Additional colors
  border: hexStringToNumber('#ced4da'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f8f9fa'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
