import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Techscape theme with teal and green topographic highlights
 */
export const techscapeTheme = createBaseTheme({
  name: 'techscape',

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
})
