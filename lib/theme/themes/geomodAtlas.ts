import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * GeoMod Atlas theme - dark theme with cyan/green
 */
export const geomodAtlasTheme = createBaseTheme({
  name: 'geomod-atlas',

  // Original colors
  primary: hexStringToRGB('#00f2ff'),
  secondary: hexStringToRGB('#00ff87'),
  accent: hexStringToRGB('#92ff00'),
  background: hexStringToNumber('#141414'),

  // Color variants
  primaryAlt: hexStringToRGB('#33f5ff'),
  primaryDark: hexStringToRGB('#00bfc6'),
  secondaryAlt: hexStringToRGB('#33ffa0'),
  secondaryDark: hexStringToRGB('#00cc6a'),
  accentAlt: hexStringToRGB('#aaff33'),
  accentDark: hexStringToRGB('#66cc00'),

  // Background variants
  backgroundAlt: hexStringToNumber('#1c1c1c'),
  backgroundDark: hexStringToNumber('#242424'),

  // Foreground colors
  foreground: hexStringToRGB('#d0fff5'),
  foregroundAlt: hexStringToRGB('#a8e6dd'),
  foregroundLight: hexStringToRGB('#80ccc6'),

  // Additional colors
  border: hexStringToNumber('#252525'),
  surface: hexStringToNumber('#202020'),
})
