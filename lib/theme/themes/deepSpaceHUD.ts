import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Deep Space HUD theme - dark theme with blue/purple
 */
export const deepSpaceHUDTheme = createBaseTheme({
  name: 'deep-space-hud',

  // Original colors
  primary: hexStringToRGB('#4263eb'),
  secondary: hexStringToRGB('#7c3aed'),
  accent: hexStringToRGB('#00ffe1'),
  background: hexStringToNumber('#0a0a0a'),

  // Color variants
  primaryAlt: hexStringToRGB('#5a78f0'),
  primaryDark: hexStringToRGB('#2a49b5'),
  secondaryAlt: hexStringToRGB('#9960f5'),
  secondaryDark: hexStringToRGB('#5d24a0'),
  accentAlt: hexStringToRGB('#66ffe8'),
  accentDark: hexStringToRGB('#00bfa1'),

  // Background variants
  backgroundAlt: hexStringToNumber('#141414'),
  backgroundDark: hexStringToNumber('#1e1e1e'),

  // Foreground colors
  foreground: hexStringToRGB('#cfd8ff'),
  foregroundAlt: hexStringToRGB('#aab8ff'),
  foregroundLight: hexStringToRGB('#8896cc'),

  // Additional colors
  border: hexStringToNumber('#2f2f2f'),
  surface: hexStringToNumber('#1a1a1a'),
})
