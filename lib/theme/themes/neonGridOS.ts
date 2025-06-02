import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Neon Grid OS theme - light theme with pink/red primary
 */
export const neonGridOSTheme = createBaseTheme({
  name: 'neon-grid-os',

  // Original colors
  primary: hexStringToRGB('#ff2d55'),
  secondary: hexStringToRGB('#ff5e3a'),
  accent: hexStringToRGB('#bd10e0'),
  background: hexStringToNumber('#f8f8f8'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff456e'),
  primaryDark: hexStringToRGB('#cc0033'),
  secondaryAlt: hexStringToRGB('#ff7755'),
  secondaryDark: hexStringToRGB('#cc3a1e'),
  accentAlt: hexStringToRGB('#d040f2'),
  accentDark: hexStringToRGB('#8800aa'),

  // Background variants
  backgroundAlt: hexStringToNumber('#e5e5e5'),
  backgroundDark: hexStringToNumber('#cccccc'),

  // Foreground colors
  foreground: hexStringToRGB('#1a1a1a'),
  foregroundAlt: hexStringToRGB('#3a3a3a'),
  foregroundLight: hexStringToRGB('#666666'),

  // Additional colors
  border: hexStringToNumber('#d8d8d8'),
  surface: hexStringToNumber('#ffffff'),
})
