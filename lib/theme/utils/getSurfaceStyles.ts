import type { UISurface } from '../types.ts'

/**
 * Surface type identifiers
 */
export type SurfaceType = 'main' | 'alt' | 'header' | 'nav' | 'card' | 'input' | 'button' | 'dropdown'

/**
 * Gets the CSS styles for a surface based on current theme mode
 */
export const getSurfaceStyles = (surface: UISurface): string => {
  const styles = []
  const { background, borderRadius, border, effects } = surface

  // Background with opacity
  styles.push(`background-color: ${background}`)

  // Border radius
  if (borderRadius !== '0px') styles.push(`border-radius: ${borderRadius}`)

  // Border styles
  if (border.width !== '0px' && border.style !== 'none') styles.push(`border: ${border.width} ${border.style} ${border.color}`)

  // Visual effects
  if (effects.backdropBlur) styles.push(`backdrop-filter: blur(${effects.backdropBlur})`)
  if (effects.blur) styles.push(`filter: ${effects.blur}`)
  if (effects.filter) styles.push(`filter: ${effects.filter}`)
  if (effects.boxShadow) styles.push(`box-shadow: ${effects.boxShadow}`)
  if (effects.transform) styles.push(`transform: ${effects.transform}`)

  return styles.join('; ')
}

/**
 * Gets individual CSS properties for a surface
 */
export const getSurfaceProperties = (surface: UISurface, mode: 'light' | 'dark') => {
  const { opacity, background, borderRadius, border, effects } = surface
  const opacityValue = mode === 'dark' ? opacity.dark : opacity.light

  return {
    backgroundColor: background,
    borderRadius: borderRadius !== '0px' ? borderRadius : undefined,
    border: border.width !== '0px' && border.style !== 'none' ? `${border.width} ${border.style} ${border.color}` : undefined,
    backdropFilter: effects.backdropBlur ? `blur(${effects.backdropBlur})` : undefined,
    filter: effects.filter || effects.blur,
    boxShadow: effects.boxShadow,
    transform: effects.transform,
    opacity: opacityValue < 1 ? opacityValue : undefined,
  }
}

/**
 * Gets CSS classes for surface styling
 */
export const getSurfaceClasses = (surfaceType: SurfaceType): string => {
  const classes = []

  // Base surface class
  classes.push(`surface-${surfaceType}`)

  // Type-specific classes
  switch (surfaceType) {
    case 'main':
      classes.push('surface-main')
      break
    case 'alt':
      classes.push('surface-alt')
      break
    case 'header':
      classes.push('surface-header')
      break
    case 'nav':
      classes.push('surface-nav')
      break
    case 'card':
      classes.push('surface-card')
      break
    case 'input':
      classes.push('surface-input')
      break
    case 'button':
      classes.push('surface-button')
      break
    case 'dropdown':
      classes.push('surface-dropdown')
      break
  }

  return classes.join(' ')
}

/**
 * Gets border radius class based on surface configuration
 */
export const getSurfaceBorderRadius = (surface: UISurface): string => {
  const radius = surface.borderRadius

  if (radius === '0px' || radius === '0') return 'rounded-none'

  // Convert common pixel values to Tailwind classes
  switch (radius) {
    case '2px':
      return 'rounded-sm'
    case '4px':
      return 'rounded'
    case '6px':
      return 'rounded-md'
    case '8px':
      return 'rounded-lg'
    case '12px':
      return 'rounded-xl'
    case '16px':
      return 'rounded-2xl'
    default:
      return ''
  }
}

/**
 * Gets border classes based on surface configuration
 */
export const getSurfaceBorderClasses = (surface: UISurface): string => {
  const { border } = surface
  const classes = []

  if (border.width === '0px' || border.style === 'none') return 'border-none'

  // Border width
  switch (border.width) {
    case '1px':
      classes.push('border')
      break
    case '2px':
      classes.push('border-2')
      break
    case '4px':
      classes.push('border-4')
      break
    case '8px':
      classes.push('border-8')
      break
    default:
      break
  }

  // Border style
  switch (border.style) {
    case 'solid':
      classes.push('border-solid')
      break
    case 'dashed':
      classes.push('border-dashed')
      break
    case 'dotted':
      classes.push('border-dotted')
      break
    case 'double':
      classes.push('border-double')
      break
  }

  return classes.join(' ')
}

/**
 * Utility to disable borders completely
 */
export const disableBorders = (): string => {
  return 'border-none'
}

/**
 * Utility to create custom border configuration
 */
export const createCustomBorder = (width: string, style: string, color: string): string => {
  return `border: ${width} ${style} ${color}`
}
