import type { BaseTheme } from '../../types.ts'
import { geomodAtlasDarkPalette, geomodAtlasSemanticPalette } from './palette.ts'

/**
 * geomod atlas dark theme using the neon grid base theme shape
 */
export const geomodAtlasDarkTheme: BaseTheme = {
  name: 'geomod-atlas-dark',
  mode: 'dark',
  palette: {
    ...geomodAtlasDarkPalette,
    semantic: geomodAtlasSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'background.950',
      opacity: 0.9,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'primary.600', opacity: 0.35 },
      effects: {
        filter: 'contrast(1.2) saturate(1.15)',
        boxShadow: '0 0 22px primary.600',
      },
    },
    shell: {
      color: 'background.900',
      opacity: 0.92,
      borderRadius: '8px',
      border: { width: '2px', style: 'solid', color: 'primary.600', opacity: 0.45 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 28px primary.600',
        filter: 'contrast(1.15) saturate(1.1)',
      },
    },
    header: {
      // inverted block for titles/navigation
      color: 'foreground.500',
      opacity: 1,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'foreground.500', opacity: 1 },
      effects: {
        boxShadow: '0 0 18px primary.500',
        filter: 'contrast(1.1) saturate(1.1)',
      },
    },
    title: {
      color: 'foreground.500',
      opacity: 1,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'foreground.500', opacity: 1 },
      effects: {
        boxShadow: '0 0 16px primary.500',
      },
    },
    elevated: {
      color: 'background.950',
      opacity: 0.95,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'primary.600', opacity: 0.5 },
      effects: {
        boxShadow: '0 0 20px primary.600',
      },
    },
  },
  backgroundOpacity: 0.85,
}
