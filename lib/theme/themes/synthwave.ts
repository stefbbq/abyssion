import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Synthwave theme with purple and pink dominant colors - dark mode
 */
export const synthwaveTheme = createBaseTheme({
  name: 'synthwave',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffffff'),
  secondary: hexStringToRGB('#cc4dff'),
  accent: hexStringToRGB('#ff3399'),
  background: hexStringToNumber('#000011'),

  // Color variants
  primaryAlt: hexStringToRGB('#e6e6e6'),
  primaryDark: hexStringToRGB('#cccccc'),
  secondaryAlt: hexStringToRGB('#d966ff'),
  secondaryDark: hexStringToRGB('#9933cc'),
  accentAlt: hexStringToRGB('#ff66b3'),
  accentDark: hexStringToRGB('#cc1a66'),

  // Background variants
  backgroundAlt: hexStringToNumber('#111122'),
  backgroundDark: hexStringToNumber('#000008'),

  // Foreground colors
  foreground: hexStringToRGB('#ffffff'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#2d2d44'),
  surface: hexStringToNumber('#1a1a22'),
  surfaceAlt: hexStringToNumber('#1a1a22'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})

/**
 * Synthwave theme with purple and pink dominant colors - light mode
 */
export const synthwaveLightTheme = createBaseTheme({
  name: 'synthwave-light',
  mode: 'light',

  // Adapted colors for light mode
  primary: hexStringToRGB('#1a0033'),
  secondary: hexStringToRGB('#6600cc'),
  accent: hexStringToRGB('#990033'),
  background: hexStringToNumber('#faf8ff'),

  // Color variants
  primaryAlt: hexStringToRGB('#330066'),
  primaryDark: hexStringToRGB('#000000'),
  secondaryAlt: hexStringToRGB('#8833d6'),
  secondaryDark: hexStringToRGB('#440099'),
  accentAlt: hexStringToRGB('#b3004d'),
  accentDark: hexStringToRGB('#660022'),

  // Background variants
  backgroundAlt: hexStringToNumber('#f2eeff'),
  backgroundDark: hexStringToNumber('#e6d9ff'),

  // Foreground colors
  foreground: hexStringToRGB('#1a0033'),
  foregroundAlt: hexStringToRGB('#330066'),
  foregroundLight: hexStringToRGB('#4d0099'),

  // Additional colors
  border: hexStringToNumber('#d9ccf0'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#fdf9ff'),
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
})
