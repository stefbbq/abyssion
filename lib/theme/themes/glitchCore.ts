import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Glitch Core theme - very dark purple theme
 */
export const glitchCoreTheme = createBaseTheme({
  name: 'glitch-core',

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
})
