import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Synthwave theme with purple and pink dominant colors
 */
export const synthwaveTheme = createBaseTheme({
  name: 'synthwave',

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
})
