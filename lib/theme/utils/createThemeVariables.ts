import type { UITheme } from '../types.ts'

/**
 * Flattens a nested theme object and converts it into a string of CSS variables.
 * @param theme - The UITheme object.
 * @returns A string of CSS variables to be injected into a <style> tag.
 *
 * @example
 * const theme = { colors: { text: { primary: '#fff' } } };
 * const cssVars = createThemeVariables(theme);
 * // returns "--color-text-primary: #fff;"
 */
export function createThemeVariables(theme: UITheme): string {
  let cssVariables = ''

  // deno-lint-ignore no-explicit-any
  const flattenObject = (object: any, prefix = '') => {
    for (const key in object) {
      if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
        flattenObject(object[key], `${prefix}${key}-`)
      } else {
        cssVariables += `--${prefix}${key}: ${object[key]};`
      }
    }
  }

  flattenObject(theme)
  return cssVariables
}
