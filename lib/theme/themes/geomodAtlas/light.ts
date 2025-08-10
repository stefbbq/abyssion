import type { BaseTheme } from '../../index.types.ts'
import { geomodAtlasLightPalette, geomodAtlasSemanticPalette } from './palette.ts'

/**
 * geomod atlas light theme using the neon grid base theme shape
 */
export const geomodAtlasLightTheme: BaseTheme = {
  name: 'geomod-atlas-light',
  mode: 'light',
  palette: {
    ...geomodAtlasLightPalette,
    semantic: geomodAtlasSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'background.100',
      opacity: 0.94,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'primary.500', opacity: 0.35 },
      effects: {
        filter: 'contrast(1.08) saturate(1.05)',
        boxShadow: '0 0 20px primary.500',
      },
    },
    shell: {
      color: 'background.50',
      opacity: 0.96,
      borderRadius: '8px',
      border: { width: '2px', style: 'solid', color: 'primary.500', opacity: 0.4 },
      effects: {
        backdropBlur: '4px',
        boxShadow: '0 0 22px primary.500',
        filter: 'contrast(1.06) saturate(1.05)',
      },
    },
    header: {
      // inverted block for titles/navigation
      color: 'foreground.500',
      opacity: 1,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'foreground.500', opacity: 1 },
      effects: {
        boxShadow: '0 0 14px primary.400',
      },
    },
    elevated: {
      color: 'background.100',
      opacity: 1,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'primary.500', opacity: 0.45 },
      effects: {
        boxShadow: '0 0 18px primary.500',
      },
    },
    title: {
      color: 'foreground.500',
      opacity: 1,
      borderRadius: '6px',
      border: { width: '2px', style: 'solid', color: 'foreground.500', opacity: 1 },
      effects: {
        boxShadow: '0 0 12px primary.400',
      },
    },
  },
  backgroundOpacity: 0.88,
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
      heading: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      body: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      quote: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    },
  },
}
