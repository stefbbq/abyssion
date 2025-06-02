import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Cyberpunk theme with cyan and magenta accents
 */
export const cyberpunkTheme = createBaseTheme({
  name: 'cyberpunk',

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
})
