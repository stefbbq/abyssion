import { createBaseTheme } from '../utils/createBaseTheme.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { hexStringToNumber } from '../colorUtils/hexStringToNumber.ts'

/**
 * Deep Space HUD theme - dark mode color palette
 * Provides building blocks for GL and UI theme generation
 */
export const deepSpaceHUDTheme = createBaseTheme({
  name: 'deep-space-hud',
  mode: 'dark',

  // Core brand colors
  primary: hexStringToRGB('#4263eb'), // Electric blue
  secondary: hexStringToRGB('#7c3aed'), // Purple
  accent: hexStringToRGB('#ff2d55'), // Magenta accent (matches logo/theme switcher)

  // Color variants
  primaryAlt: hexStringToRGB('#5a78f0'),
  primaryDark: hexStringToRGB('#2a49b5'),
  secondaryAlt: hexStringToRGB('#9960f5'),
  secondaryDark: hexStringToRGB('#5d24a0'),
  accentAlt: hexStringToRGB('#ff5e99'),
  accentDark: hexStringToRGB('#b8003a'),

  // Backgrounds
  background: hexStringToNumber('#0a0a0c'), // Slightly warmer black
  backgroundAlt: hexStringToNumber('#18141c'), // Subtle purple tint
  backgroundDark: hexStringToNumber('#08080a'),
  surface: hexStringToNumber('#18141c'), // Card/nav surface (matches screenshot)
  surfaceAlt: hexStringToNumber('#221c2a'),

  // Foregrounds
  foreground: hexStringToRGB('#ffffff'),
  foregroundAlt: hexStringToRGB('#e5e5e5'),
  foregroundLight: hexStringToRGB('#bdbdbd'),

  // Borders
  border: hexStringToNumber('#3a2a4d'), // Muted purple-gray

  // Typography
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

  // Theme Extensions (SURFACE_SYSTEM, THEME_EXTENSIONS)
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  glassOpacity: {
    light: 0.4,
    dark: 0.6,
  },
  frostOpacity: {
    light: 0.5,
    dark: 0.5,
  },
  backgroundOpacity: {
    light: 0.7,
    dark: 0.5, // Strong overlay in dark mode
  },
  filters: {
    main: 'brightness(1.02) contrast(1.05)',
    header: 'brightness(1.01) saturate(1.1)',
    nav: 'brightness(1.03) saturate(1.1)',
  },
  surfaces: {
    main: {
      color: 'background.primary',
      opacity: { light: 0.4, dark: 0.4 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '12px',
        filter: 'brightness(1.02) contrast(1.05)',
        boxShadow: '0 0 16px 0 rgba(255,45,85,0.18)',
      },
    },
    alt: {
      color: 'background.secondary',
      opacity: { light: 0.3, dark: 0.8 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '12px',
        filter: 'brightness(1.01) contrast(1.03)',
        boxShadow: '0 0 12px 0 rgba(255,45,85,0.12)',
      },
    },
    card: {
      color: 'surface.primary',
      opacity: { light: 0.4, dark: 0.88 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '16px',
        boxShadow: '0 0 24px 0 rgba(255,45,85,0.22)',
      },
    },
    header: {
      color: 'background.primary',
      opacity: { light: 0.4, dark: 0.92 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '16px',
        filter: 'brightness(1.01) saturate(1.1)',
        boxShadow: '0 0 12px 0 rgba(255,45,85,0.12)',
      },
    },
    nav: {
      color: 'background.secondary',
      opacity: { light: 0.4, dark: 0.92 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '16px',
        filter: 'brightness(1.03) saturate(1.1)',
        boxShadow: '0 0 12px 0 rgba(255,45,85,0.12)',
      },
    },
  },
})

/**
 * Deep Space HUD theme - light mode variant
 * Same color palette but inverted for light backgrounds
 */
export const deepSpaceHUDLightTheme = createBaseTheme({
  name: 'deep-space-hud-light',
  mode: 'light',

  primary: hexStringToRGB('#4263eb'),
  secondary: hexStringToRGB('#7c3aed'),
  accent: hexStringToRGB('#ff2d55'),

  primaryAlt: hexStringToRGB('#5a78f0'),
  primaryDark: hexStringToRGB('#2a49b5'),
  secondaryAlt: hexStringToRGB('#9960f5'),
  secondaryDark: hexStringToRGB('#5d24a0'),
  accentAlt: hexStringToRGB('#ff5e99'),
  accentDark: hexStringToRGB('#b8003a'),

  background: hexStringToNumber('#faf8f5'), // Warm off-white
  backgroundAlt: hexStringToNumber('#f5f2ee'),
  backgroundDark: hexStringToNumber('#f0ebe6'),
  surface: hexStringToNumber('#ffffff'),
  surfaceAlt: hexStringToNumber('#f5f2ee'),

  foreground: hexStringToRGB('#000000'),
  foregroundAlt: hexStringToRGB('#333333'),
  foregroundLight: hexStringToRGB('#666666'),

  border: hexStringToNumber('#e0e0e0'),
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
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  glassOpacity: {
    light: 0.92, // High opacity for glass effect in light mode
    dark: 0.85,
  },
  frostOpacity: {
    light: 0.92,
    dark: 0.92,
  },
  backgroundOpacity: {
    light: 0.92, // Strong overlay in light mode
    dark: 0.85,
  },
  filters: {
    main: 'brightness(1.01) contrast(1.01)',
    header: 'brightness(1.01) saturate(1.1)',
    nav: 'brightness(1.01) saturate(1.1)',
  },
  surfaces: {
    main: {
      color: 'background.primary',
      opacity: { light: 0.92, dark: 0.85 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '12px',
        filter: 'brightness(1.01) contrast(1.01)',
        boxShadow: '0 0 16px 0 rgba(255,45,85,0.10)',
      },
    },
    alt: {
      color: 'background.secondary',
      opacity: { light: 0.85, dark: 0.8 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '12px',
        filter: 'brightness(1.01) contrast(1.01)',
        boxShadow: '0 0 12px 0 rgba(255,45,85,0.08)',
      },
    },
    card: {
      color: 'surface.primary',
      opacity: { light: 0.95, dark: 0.88 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '16px',
        boxShadow: '0 0 24px 0 rgba(255,45,85,0.12)',
      },
    },
    header: {
      color: 'background.primary',
      opacity: { light: 0.92, dark: 0.85 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '16px',
        filter: 'brightness(1.01) saturate(1.1)',
        boxShadow: '0 0 12px 0 rgba(255,45,85,0.08)',
      },
    },
    nav: {
      color: 'background.secondary',
      opacity: { light: 0.92, dark: 0.85 },
      borderRadius: '1rem',
      border: {
        width: '2px',
        style: 'solid',
        color: 'border.primary',
      },
      effects: {
        backdropBlur: '16px',
        filter: 'brightness(1.01) saturate(1.1)',
        boxShadow: '0 0 12px 0 rgba(255,45,85,0.08)',
      },
    },
  },
})
