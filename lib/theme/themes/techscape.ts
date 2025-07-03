import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { hexStringToNumber } from '../colorUtils/hexStringToNumber.ts'

/**
 * Techscape theme with teal and green topographic highlights - dark mode
 */
export const techscapeTheme = createBaseTheme({
  name: 'techscape',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffffff'),
  secondary: hexStringToRGB('#00cccc'),
  accent: hexStringToRGB('#66e680'),
  background: hexStringToNumber('#151515'),

  // Color variants
  primaryAlt: hexStringToRGB('#e6e6e6'),
  primaryDark: hexStringToRGB('#cccccc'),
  secondaryAlt: hexStringToRGB('#33d6d6'),
  secondaryDark: hexStringToRGB('#009999'),
  accentAlt: hexStringToRGB('#80ff99'),
  accentDark: hexStringToRGB('#4dcc66'),

  // Background variants
  backgroundAlt: hexStringToNumber('#1a1a1a'),
  backgroundDark: hexStringToNumber('#0f0f0f'),

  // Foreground colors
  foreground: hexStringToRGB('#ffffff'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#333333'),
  surface: hexStringToNumber('#202020'),
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
 * Techscape theme with teal and green topographic highlights - light mode
 */
export const techscapeLightTheme = createBaseTheme({
  name: 'techscape-light',
  mode: 'light',

  // Adapted colors for light mode
  primary: hexStringToRGB('#003333'),
  secondary: hexStringToRGB('#006666'),
  accent: hexStringToRGB('#339947'),
  background: hexStringToNumber('#f5fcfc'),

  // Color variants
  primaryAlt: hexStringToRGB('#004d4d'),
  primaryDark: hexStringToRGB('#001a1a'),
  secondaryAlt: hexStringToRGB('#008080'),
  secondaryDark: hexStringToRGB('#004d4d'),
  accentAlt: hexStringToRGB('#4dcc66'),
  accentDark: hexStringToRGB('#1a7a2e'),

  // Background variants
  backgroundAlt: hexStringToNumber('#ebf9f9'),
  backgroundDark: hexStringToNumber('#e1f5f5'),

  // Foreground colors
  foreground: hexStringToRGB('#001a1a'),
  foregroundAlt: hexStringToRGB('#003333'),
  foregroundLight: hexStringToRGB('#004d4d'),

  // Additional colors
  border: hexStringToNumber('#b3e6e6'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f9fefe'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
