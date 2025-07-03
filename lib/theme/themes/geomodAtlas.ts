import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { hexStringToNumber } from '../colorUtils/hexStringToNumber.ts'

/**
 * GeoMod Atlas theme - dark theme with cyan/green
 */
export const geomodAtlasTheme = createBaseTheme({
  name: 'geomod-atlas',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#00f2ff'),
  secondary: hexStringToRGB('#00ff87'),
  accent: hexStringToRGB('#92ff00'),
  background: hexStringToNumber('#141414'),

  // Color variants
  primaryAlt: hexStringToRGB('#33f5ff'),
  primaryDark: hexStringToRGB('#00bfc6'),
  secondaryAlt: hexStringToRGB('#33ffa0'),
  secondaryDark: hexStringToRGB('#00cc6a'),
  accentAlt: hexStringToRGB('#aaff33'),
  accentDark: hexStringToRGB('#66cc00'),

  // Background variants
  backgroundAlt: hexStringToNumber('#1c1c1c'),
  backgroundDark: hexStringToNumber('#242424'),

  // Foreground colors
  foreground: hexStringToRGB('#d0fff5'),
  foregroundAlt: hexStringToRGB('#a8e6dd'),
  foregroundLight: hexStringToRGB('#80ccc6'),

  // Additional colors
  border: hexStringToNumber('#252525'),
  surface: hexStringToNumber('#202020'),
  surfaceAlt: hexStringToNumber('#252525'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})

/**
 * GeoMod Atlas theme - light theme with cyan/green
 */
export const geomodAtlasLightTheme = createBaseTheme({
  name: 'geomod-atlas-light',
  mode: 'light',

  // Adapted colors for light mode
  primary: hexStringToRGB('#006b73'),
  secondary: hexStringToRGB('#00804d'),
  accent: hexStringToRGB('#4d8000'),
  background: hexStringToNumber('#f0fffe'),

  // Color variants
  primaryAlt: hexStringToRGB('#008a94'),
  primaryDark: hexStringToRGB('#004d52'),
  secondaryAlt: hexStringToRGB('#009966'),
  secondaryDark: hexStringToRGB('#005c33'),
  accentAlt: hexStringToRGB('#669900'),
  accentDark: hexStringToRGB('#336600'),

  // Background variants
  backgroundAlt: hexStringToNumber('#e6fffe'),
  backgroundDark: hexStringToNumber('#d9fffc'),

  // Foreground colors
  foreground: hexStringToRGB('#0d3330'),
  foregroundAlt: hexStringToRGB('#1a4d47'),
  foregroundLight: hexStringToRGB('#336661'),

  // Additional colors
  border: hexStringToNumber('#b3e6e0'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f5fffd'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
