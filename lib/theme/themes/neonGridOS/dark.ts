import type { BaseTheme } from '../../index.types.ts'
import { neonGridDarkPalette, neonGridSemanticPalette } from './palette.ts'

export const neonGridOSDarkTheme: BaseTheme = {
  name: 'neon-grid-os-dark',
  mode: 'dark',
  palette: {
    ...neonGridDarkPalette,
    semantic: neonGridSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'perspective(800px) rotateX(0.8deg) scale(1.003, 0.997) brightness(1.05) contrast(1.08) hue-rotate(1deg)',
      },
    },
    shell: {
      color: 'surface.950',
      opacity: 0.75,
      borderRadius: '16px',
      border: { width: '0', style: 'none', color: 'foreground.500', opacity: 0.2 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 8px rgba(0,0,0,.1)',
      },
    },
    header: {
      color: 'surface.1000',
      opacity: 0.91,
      borderRadius: '12px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 10px 20px rgba(0,0,0,.5)',
      },
    },
    elevated: {
      color: 'surface.600',
      opacity: 1,
      borderRadius: '9px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.2 },
      effects: {},
    },
  },
  backgroundOpacity: 0.8,
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    shellCollapsed: '32px',
    shellExpanded: '20px',
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
