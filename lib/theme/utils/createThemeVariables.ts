// deno-lint-ignore-file no-explicit-any
import type { UITheme } from '@lib/theme/types.ts'

/**
 * Flattens a nested theme object and converts it into a string of CSS custom properties.
 *
 * @example
 * // Input: { colors: { primary: '#fff' } }
 * // Output: '--colors-primary: #fff;'
 */
const flattenThemeObject = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '-' : ''
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenThemeObject(obj[k], pre + k))
    } else {
      acc[pre + k] = obj[k]
    }
    return acc
  }, {} as Record<string, string>)
}

/**
 * Creates a CSS string of custom properties from a UITheme object.
 * This string can be injected into a <style> tag.
 */
export const createThemeVariables = (theme: UITheme): string => {
  const flattenedTheme = flattenThemeObject(theme)
  const variableString = Object.entries(flattenedTheme)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n')

  return `:root {\n${variableString}\n}`
}
