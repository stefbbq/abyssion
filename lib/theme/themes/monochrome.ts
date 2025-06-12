import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Monochrome theme with white and gray tones
 */
export const monochromeTheme = createBaseTheme({
  name: 'monochrome',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffffff'),
  secondary: hexStringToRGB('#cccccc'),
  accent: hexStringToRGB('#999999'),
  background: hexStringToNumber('#000000'),

  // Color variants
  primaryAlt: hexStringToRGB('#e6e6e6'),
  primaryDark: hexStringToRGB('#cccccc'),
  secondaryAlt: hexStringToRGB('#d9d9d9'),
  secondaryDark: hexStringToRGB('#999999'),
  accentAlt: hexStringToRGB('#b3b3b3'),
  accentDark: hexStringToRGB('#666666'),

  // Background variants
  backgroundAlt: hexStringToNumber('#111111'),
  backgroundDark: hexStringToNumber('#222222'),

  // Foreground colors
  foreground: hexStringToRGB('#ffffff'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#333333'),
  surface: hexStringToNumber('#1a1a1a'),
})
