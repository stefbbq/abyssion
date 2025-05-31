import type { Logo3DTheme } from '../theme.d.ts'

/**
 * Creates a theme validator that checks required properties
 * Pure function that validates theme completeness
 */
export const validateTheme = (theme: Logo3DTheme): boolean => {
  const requiredKeys: (keyof Logo3DTheme)[] = [
    'primary',
    'secondary',
    'accent',
    'background',
    'stencilColor',
    'baseLayerColor',
    'outlineColor',
    'ghostingColors',
    'ui',
    'geometric',
    'lensFlare',
  ]

  return requiredKeys.every((key) => theme[key] !== undefined)
}
