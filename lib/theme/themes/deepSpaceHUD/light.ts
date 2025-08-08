import type { BaseTheme } from '../../index.types.ts'
import { deepSpaceHUDLightPalette, deepSpaceHUDSemanticPalette } from './palette.ts'

/**
 * deep space hud light theme using the neon grid base theme shape
 */
export const deepSpaceHUDLightTheme: BaseTheme = {
  name: 'deep-space-hud-light',
  mode: 'light',
  palette: {
    ...deepSpaceHUDLightPalette,
    semantic: deepSpaceHUDSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'brightness(1.01) contrast(1.02)',
      },
    },
    shell: {
      color: 'surface.500',
      opacity: 0.86,
      borderRadius: '14px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.18 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 10px rgba(0,0,0,.12)',
      },
    },
    header: {
      color: 'surface.100',
      opacity: 0.92,
      borderRadius: '14px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '10px',
        boxShadow: '0 10px 20px rgba(0,0,0,.35)',
      },
    },
    elevated: {
      color: 'surface.700',
      opacity: 0.95,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.22 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
      },
    },
  },
  backgroundOpacity: 0.86,
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
