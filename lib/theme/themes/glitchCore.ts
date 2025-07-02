import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Glitch Core theme - very dark purple theme
 */
export const glitchCoreTheme = createBaseTheme({
  name: 'glitch-core',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ff005c'),
  secondary: hexStringToRGB('#6200ea'),
  accent: hexStringToRGB('#00ffe7'),
  background: hexStringToNumber('#07001a'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff3380'),
  primaryDark: hexStringToRGB('#cc004a'),
  secondaryAlt: hexStringToRGB('#8333f0'),
  secondaryDark: hexStringToRGB('#4000aa'),
  accentAlt: hexStringToRGB('#66fff1'),
  accentDark: hexStringToRGB('#00bfa9'),

  // Background variants
  backgroundAlt: hexStringToNumber('#120033'),
  backgroundDark: hexStringToNumber('#1f004d'),

  // Foreground colors
  foreground: hexStringToRGB('#d7d7ff'),
  foregroundAlt: hexStringToRGB('#b4b4e6'),
  foregroundLight: hexStringToRGB('#9292cc'),

  // Additional colors
  border: hexStringToNumber('#222222'),
  surface: hexStringToNumber('#12002b'),
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
 * Glitch Core theme - light purple theme
 */
export const glitchCoreLightTheme = createBaseTheme({
  name: 'glitch-core-light',
  mode: 'light',

  // Adapted colors for light mode
  primary: hexStringToRGB('#cc004a'),
  secondary: hexStringToRGB('#4000aa'),
  accent: hexStringToRGB('#00998a'),
  background: hexStringToNumber('#faf8ff'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff3380'),
  primaryDark: hexStringToRGB('#990033'),
  secondaryAlt: hexStringToRGB('#6633cc'),
  secondaryDark: hexStringToRGB('#330066'),
  accentAlt: hexStringToRGB('#00ccb3'),
  accentDark: hexStringToRGB('#006659'),

  // Background variants
  backgroundAlt: hexStringToNumber('#f0eeff'),
  backgroundDark: hexStringToNumber('#e6e0ff'),

  // Foreground colors
  foreground: hexStringToRGB('#1a0d33'),
  foregroundAlt: hexStringToRGB('#331a4d'),
  foregroundLight: hexStringToRGB('#4d3366'),

  // Additional colors
  border: hexStringToNumber('#d4ccf0'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f9f7ff'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
