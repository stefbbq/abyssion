import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { hexStringToNumber } from '../colorUtils/hexStringToNumber.ts'

/**
 * Synth Drift theme - light theme with magenta/green/purple
 */
export const synthDriftTheme = createBaseTheme({
  name: 'synth-drift',
  mode: 'light',

  // Original colors
  primary: hexStringToRGB('#ff00cc'),
  secondary: hexStringToRGB('#00ff99'),
  accent: hexStringToRGB('#775fff'),
  background: hexStringToNumber('#e6e6e6'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff33d6'),
  primaryDark: hexStringToRGB('#cc009f'),
  secondaryAlt: hexStringToRGB('#33ffaa'),
  secondaryDark: hexStringToRGB('#00cc7a'),
  accentAlt: hexStringToRGB('#9980ff'),
  accentDark: hexStringToRGB('#5540cc'),

  // Background variants
  backgroundAlt: hexStringToNumber('#f2f2f2'),
  backgroundDark: hexStringToNumber('#cccccc'),

  // Foreground colors
  foreground: hexStringToRGB('#111111'),
  foregroundAlt: hexStringToRGB('#333333'),
  foregroundLight: hexStringToRGB('#666666'),

  // Additional colors
  border: hexStringToNumber('#cccccc'),
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
 * Synth Drift theme - dark theme with magenta/green/purple
 */
export const synthDriftDarkTheme = createBaseTheme({
  name: 'synth-drift-dark',
  mode: 'dark',

  // Adapted colors for dark mode
  primary: hexStringToRGB('#ff33d6'),
  secondary: hexStringToRGB('#33ffaa'),
  accent: hexStringToRGB('#9980ff'),
  background: hexStringToNumber('#0f0f0f'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff66e0'),
  primaryDark: hexStringToRGB('#cc00a6'),
  secondaryAlt: hexStringToRGB('#66ffbb'),
  secondaryDark: hexStringToRGB('#00cc80'),
  accentAlt: hexStringToRGB('#b399ff'),
  accentDark: hexStringToRGB('#6600cc'),

  // Background variants
  backgroundAlt: hexStringToNumber('#1a1a1a'),
  backgroundDark: hexStringToNumber('#262626'),

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
