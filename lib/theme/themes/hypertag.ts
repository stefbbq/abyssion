import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { hexStringToNumber } from '../colorUtils/hexStringToNumber.ts'

/**
 * HyperTag theme - black theme with yellow/red/orange
 */
export const hypertagTheme = createBaseTheme({
  name: 'hypertag',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffec00'),
  secondary: hexStringToRGB('#ff0055'),
  accent: hexStringToRGB('#ff9900'),
  background: hexStringToNumber('#000000'),

  // Color variants
  primaryAlt: hexStringToRGB('#fff233'),
  primaryDark: hexStringToRGB('#ccb800'),
  secondaryAlt: hexStringToRGB('#ff3380'),
  secondaryDark: hexStringToRGB('#cc0044'),
  accentAlt: hexStringToRGB('#ffb733'),
  accentDark: hexStringToRGB('#cc7a00'),

  // Background variants
  backgroundAlt: hexStringToNumber('#111111'),
  backgroundDark: hexStringToNumber('#1a1a1a'),

  // Foreground colors
  foreground: hexStringToRGB('#fefefe'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#1e1e1e'),
  surface: hexStringToNumber('#0a0a0a'),
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
 * HyperTag theme - light theme with yellow/red/orange
 */
export const hypertagLightTheme = createBaseTheme({
  name: 'hypertag-light',
  mode: 'light',

  // Adapted colors for light mode
  primary: hexStringToRGB('#cc9900'),
  secondary: hexStringToRGB('#cc0044'),
  accent: hexStringToRGB('#cc7a00'),
  background: hexStringToNumber('#fffcf5'),

  // Color variants
  primaryAlt: hexStringToRGB('#e6b300'),
  primaryDark: hexStringToRGB('#996600'),
  secondaryAlt: hexStringToRGB('#e6336b'),
  secondaryDark: hexStringToRGB('#990033'),
  accentAlt: hexStringToRGB('#e69500'),
  accentDark: hexStringToRGB('#994d00'),

  // Background variants
  backgroundAlt: hexStringToNumber('#fff9e6'),
  backgroundDark: hexStringToNumber('#fff2d9'),

  // Foreground colors
  foreground: hexStringToRGB('#1a1a00'),
  foregroundAlt: hexStringToRGB('#333300'),
  foregroundLight: hexStringToRGB('#666600'),

  // Additional colors
  border: hexStringToNumber('#e6d9b3'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#fffef5'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
