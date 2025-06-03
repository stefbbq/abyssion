import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../utils/hexStringToRGB.ts'
import { hexStringToNumber } from '../utils/hexStringToNumber.ts'

/**
 * Deep Space HUD theme - dark mode color palette
 * Provides building blocks for GL and UI theme generation
 */
export const deepSpaceHUDTheme = createBaseTheme({
  name: 'deep-space-hud',
  mode: 'dark', // explicit mode declaration

  // Core brand colors - consistent across GL and UI
  primary: hexStringToRGB('#4263eb'), // Electric blue
  secondary: hexStringToRGB('#7c3aed'), // Purple
  accent: hexStringToRGB('#00ffe1'), // Cyan accent

  // Color variants for different states
  primaryAlt: hexStringToRGB('#5a78f0'), // Lighter blue
  primaryDark: hexStringToRGB('#2a49b5'), // Darker blue
  secondaryAlt: hexStringToRGB('#9960f5'), // Lighter purple
  secondaryDark: hexStringToRGB('#5d24a0'), // Darker purple
  accentAlt: hexStringToRGB('#66ffe8'), // Lighter cyan
  accentDark: hexStringToRGB('#00bfa1'), // Darker cyan

  // Dark mode backgrounds
  background: hexStringToNumber('#000000'), // True black
  backgroundAlt: hexStringToNumber('#0a0a0a'), // Near black
  backgroundDark: hexStringToNumber('#050505'), // Darker variant
  surface: hexStringToNumber('#111111'), // Elevated surfaces

  // Dark mode foregrounds - high contrast for readability
  foreground: hexStringToRGB('#ffffff'), // Pure white text
  foregroundAlt: hexStringToRGB('#e5e5e5'), // Secondary text
  foregroundLight: hexStringToRGB('#999999'), // Tertiary text

  // Dark mode borders - much brighter for visibility
  border: hexStringToNumber('#666666'), // Brighter gray borders
})

/**
 * Deep Space HUD theme - light mode variant
 * Same color palette but inverted for light backgrounds
 */
export const deepSpaceHUDLightTheme = createBaseTheme({
  name: 'deep-space-hud-light',
  mode: 'light',

  // Same brand colors work in both modes
  primary: hexStringToRGB('#4263eb'),
  secondary: hexStringToRGB('#7c3aed'),
  accent: hexStringToRGB('#00ffe1'),

  // Color variants
  primaryAlt: hexStringToRGB('#5a78f0'),
  primaryDark: hexStringToRGB('#2a49b5'),
  secondaryAlt: hexStringToRGB('#9960f5'),
  secondaryDark: hexStringToRGB('#5d24a0'),
  accentAlt: hexStringToRGB('#66ffe8'),
  accentDark: hexStringToRGB('#00bfa1'),

  // Light mode backgrounds
  background: hexStringToNumber('#ffffff'), // Pure white
  backgroundAlt: hexStringToNumber('#f8f9fa'), // Light gray
  backgroundDark: hexStringToNumber('#f1f3f4'), // Slightly darker
  surface: hexStringToNumber('#ffffff'), // White surfaces

  // Light mode foregrounds - dark text for contrast
  foreground: hexStringToRGB('#000000'), // Pure black text
  foregroundAlt: hexStringToRGB('#333333'), // Dark gray
  foregroundLight: hexStringToRGB('#666666'), // Medium gray

  // Light mode borders
  border: hexStringToNumber('#e0e0e0'), // Light gray borders
})
