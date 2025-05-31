import type { Logo3DTheme } from '../theme.d.ts'

/**
 * Merges theme overrides into a base theme
 * Pure function that returns new theme without mutating inputs
 */
export const mergeTheme = (baseTheme: Logo3DTheme) => (overrides: Partial<Logo3DTheme>): Logo3DTheme => ({
  ...baseTheme,
  ...overrides,
  ui: {
    ...baseTheme.ui,
    ...(overrides.ui || {}),
  },
  geometric: {
    ...baseTheme.geometric,
    ...(overrides.geometric || {}),
  },
  lensFlare: {
    ...baseTheme.lensFlare,
    ...(overrides.lensFlare || {}),
  },
  ghostingColors: {
    ...baseTheme.ghostingColors,
    ...(overrides.ghostingColors || {}),
  },
})
