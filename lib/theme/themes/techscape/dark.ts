import type { BaseTheme } from '../../index.types.ts'
import { techscapeDarkPalette, techscapeSemanticPalette } from './palette.ts'

/**
 * techscape dark theme using the neon grid base theme shape
 */
export const techscapeDarkTheme: BaseTheme = {
  name: 'techscape-dark',
  mode: 'dark',
  palette: {
    ...techscapeDarkPalette,
    semantic: techscapeSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'brightness(1.02) contrast(1.05)',
      },
    },
    shell: {
      color: 'surface.950',
      opacity: 0.82,
      borderRadius: '16px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.2 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 0 12px rgba(0,0,0,.2)',
      },
    },
    header: {
      color: 'surface.1000',
      opacity: 0.92,
      borderRadius: '12px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '10px',
        boxShadow: '0 12px 22px rgba(0,0,0,.5)',
      },
    },
    elevated: {
      color: 'surface.600',
      opacity: 1,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.24 },
      effects: {},
    },
  },
  backgroundOpacity: 0.82,
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    shellCollapsed: '30px',
    shellExpanded: '18px',
  },
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
}
