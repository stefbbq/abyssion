import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Synth Drift theme - light theme with magenta/green/purple
 */
export const synthDriftTheme = createBaseTheme({
  name: 'synth-drift',
  mode: 'light',

  // Original colors
  primary: hexStringToRGB('#ff00cc'),
  secondary: hexStringToRGB('#00ff99'),
  accent: hexStringToRGB('#775fff'),
  background: hexStringToNumber('#e6e6e6'),

  // Color variants
  primaryAlt: hexStringToRGB('#ff33d6'),
  primaryDark: hexStringToRGB('#cc009f'),
  secondaryAlt: hexStringToRGB('#33ffaa'),
  secondaryDark: hexStringToRGB('#00cc7a'),
  accentAlt: hexStringToRGB('#9980ff'),
  accentDark: hexStringToRGB('#5540cc'),

  // Background variants
  backgroundAlt: hexStringToNumber('#f2f2f2'),
  backgroundDark: hexStringToNumber('#cccccc'),

  // Foreground colors
  foreground: hexStringToRGB('#111111'),
  foregroundAlt: hexStringToRGB('#333333'),
  foregroundLight: hexStringToRGB('#666666'),

  // Additional colors
  border: hexStringToNumber('#cccccc'),
  surface: hexStringToNumber('#ffffff'),
})
