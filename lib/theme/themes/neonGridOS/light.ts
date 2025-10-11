import type { BaseTheme } from '../../types.ts'
import { neonGridLightPalette, neonGridSemanticPalette } from './palette.ts'

export const neonGridOSLightTheme: BaseTheme = {
  name: 'neon-grid-os-light',
  mode: 'light',
  palette: {
    ...neonGridLightPalette,
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
      color: 'surface.500',
      opacity: 0.8,
      borderRadius: '12px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.2 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 8px rgba(0,0,0,.2)',
      },
    },
    header: {
      color: 'surface.100',
      opacity: 0.9,
      borderRadius: '12px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 10px 20px rgba(0,0,0,.5)',
      },
    },
    elevated: {
      color: 'surface.700',
      opacity: 0.9,
      borderRadius: '9px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.3 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.15)',
      },
    },
  },
  backgroundOpacity: 0.8,
}
