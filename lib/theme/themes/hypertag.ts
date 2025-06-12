import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * HyperTag theme - black theme with yellow/red/orange
 */
export const hypertagTheme = createBaseTheme({
  name: 'hypertag',
  mode: 'dark',

  // Original colors
  primary: hexStringToRGB('#ffec00'),
  secondary: hexStringToRGB('#ff0055'),
  accent: hexStringToRGB('#ff9900'),
  background: hexStringToNumber('#000000'),

  // Color variants
  primaryAlt: hexStringToRGB('#fff233'),
  primaryDark: hexStringToRGB('#ccb800'),
  secondaryAlt: hexStringToRGB('#ff3380'),
  secondaryDark: hexStringToRGB('#cc0044'),
  accentAlt: hexStringToRGB('#ffb733'),
  accentDark: hexStringToRGB('#cc7a00'),

  // Background variants
  backgroundAlt: hexStringToNumber('#111111'),
  backgroundDark: hexStringToNumber('#1a1a1a'),

  // Foreground colors
  foreground: hexStringToRGB('#fefefe'),
  foregroundAlt: hexStringToRGB('#cccccc'),
  foregroundLight: hexStringToRGB('#999999'),

  // Additional colors
  border: hexStringToNumber('#1e1e1e'),
  surface: hexStringToNumber('#0a0a0a'),
})
