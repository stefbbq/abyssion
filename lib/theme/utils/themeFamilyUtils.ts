import type { BaseTheme, ThemeFamily } from '../index.types.ts'
import { themeFamilies } from '../themes/index.ts'

/**
 * Gets the next theme family in the cycle
 */
export const getNextThemeFamily = (currentFamilyName: string): ThemeFamily => {
  const currentIndex = themeFamilies.findIndex((family) => family.name === currentFamilyName)
  const nextIndex = (currentIndex + 1) % themeFamilies.length
  return themeFamilies[nextIndex]
}
/**
 * Gets all available theme families
 */
export const getAllThemeFamilies = (): ThemeFamily[] => themeFamilies

/**
 * Gets the next theme family without switching to it
 *
 * @param {string} currentFamilyName - The name of the current theme family
 *
 * @returns {BaseTheme} The next theme family preview
 */
export const getNextThemeFamilyPreview = (currentFamilyName: string, mode: 'light' | 'dark'): BaseTheme => {
  const nextFamily = getNextThemeFamily(currentFamilyName)
  return mode === 'dark' ? nextFamily.dark : nextFamily.light
}

/**
 * Gets all individual themes (flattened from families)
 */
export const getAllThemes = (): BaseTheme[] => themeFamilies.flatMap((f) => [f.light, f.dark])

/**
 * Finds a theme family by name
 */
export const findThemeFamily = (familyName: string): ThemeFamily | undefined => themeFamilies.find((f) => f.name === familyName)
