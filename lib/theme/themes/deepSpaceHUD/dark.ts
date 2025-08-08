import type { BaseTheme } from '../../index.types.ts'
import { deepSpaceHUDDarkPalette, deepSpaceHUDSemanticPalette } from './palette.ts'

/**
 * deep space hud dark theme using the neon grid base theme shape
 */
export const deepSpaceHUDDarkTheme: BaseTheme = {
  name: 'deep-space-hud-dark',
  mode: 'dark',
  palette: {
    ...deepSpaceHUDDarkPalette,
    semantic: deepSpaceHUDSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'brightness(1.03) contrast(1.06) hue-rotate(2deg)',
      },
    },
    shell: {
      color: 'surface.950',
      opacity: 0.78,
      borderRadius: '18px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.22 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,.18)',
      },
    },
    header: {
      color: 'surface.1000',
      opacity: 0.9,
      borderRadius: '14px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '10px',
        boxShadow: '0 12px 24px rgba(0,0,0,.55)',
      },
    },
    elevated: {
      color: 'surface.600',
      opacity: 1,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.25 },
      effects: {},
    },
  },
  backgroundOpacity: 0.75,
  borderRadius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    full: '9999px',
    shellCollapsed: '28px',
    shellExpanded: '18px',
  },
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
}
