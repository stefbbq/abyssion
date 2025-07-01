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

  // Dark mode backgrounds - warm undertones complement cool primary colors
  background: hexStringToNumber('#0a0a0a'), // Warm off-black with subtle brown undertones
  backgroundAlt: hexStringToNumber('#080808'), // Near black with warmth
  backgroundDark: hexStringToNumber('#0a0a0a'), // Deeper warm dark
  surface: hexStringToNumber('#0c0c0c'), // Elevated surfaces with warm tint
  surfaceAlt: hexStringToNumber('#0d0d0d'), // Elevated surfaces with warm tint

  // Dark mode foregrounds - high contrast for readability
  foreground: hexStringToRGB('#ffffff'), // Pure white text
  foregroundAlt: hexStringToRGB('#e5e5e5'), // Secondary text
  foregroundLight: hexStringToRGB('#999999'), // Tertiary text

  // Dark mode borders - much brighter for visibility
  border: hexStringToNumber('#666666'), // Brighter gray borders
  typography: {
    fontFamily: {
      heading: '"Oxanium", sans-serif',
      body: '"Oxanium", sans-serif',
      quote: '"EB Garamond", serif',
    },
    fontUrls: [
      'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap',
    ],
  },
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

  // Light mode backgrounds - warm off-white complements cool primary colors
  background: hexStringToNumber('#faf8f5'), // Warm off-white with cream undertones
  backgroundAlt: hexStringToNumber('#f5f2ee'), // Slightly darker warm tone
  backgroundDark: hexStringToNumber('#f0ebe6'), // Deeper warm background
  surface: hexStringToNumber('#ffffff'), // Pure white for elevated surfaces
  surfaceAlt: hexStringToNumber('#faf8f5'),

  // Light mode foregrounds - dark text for contrast
  foreground: hexStringToRGB('#000000'), // Pure black text
  foregroundAlt: hexStringToRGB('#333333'), // Dark gray
  foregroundLight: hexStringToRGB('#666666'), // Medium gray

  // Light mode borders
  border: hexStringToNumber('#e0e0e0'), // Light gray borders
  typography: {
    fontFamily: {
      heading: '"Oxanium", sans-serif',
      body: '"Oxanium", sans-serif',
      quote: '"EB Garamond", serif',
    },
    fontUrls: [
      'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap',
    ],
  },
})
