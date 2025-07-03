// deno-lint-ignore-file no-explicit-any
import type { UITheme } from '@lib/theme/types.ts'
import { hexStringToCSSRGB } from '../colorUtils/hexStringToCSSRGB.ts'

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
      // If value is a hex color, add -rgb version
      if (typeof obj[k] === 'string' && obj[k].match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
        const rgb = hexStringToCSSRGB(obj[k])
        if (rgb) acc[pre + k + '-rgb'] = rgb
      }
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
