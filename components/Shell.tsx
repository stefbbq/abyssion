import { ComponentChildren } from 'preact'

type Props = {
  // section content
  children: ComponentChildren
  // additional class names
  className?: string
  // element type to render as
  as?: 'section' | 'nav' | 'div'
  // additional HTML attributes
  id?: string
  style?: Record<string, string | number>
}

/**
 * Shell component
 * Provides a rounded, glass-effect container for content that can render as different HTML elements.
 * Theming and layout are handled via CSS variables and utility classes.
 * Uses theme-aware border radius for consistent styling.
 *
 * - Use `as` prop to specify element type: 'section' (default), 'nav', 'div'
 * - Navigation shells automatically get appropriate ARIA attributes
 * - Surface styling adapts based on element type
 *
 * @example
 *   <Shell>Content</Shell>
 *   <Shell as="nav">Navigation content</Shell>
 */

export const Shell = ({ children, className, as = 'section', id, style }: Props) => {
  // surface class based on element type
  const getSurfaceClass = () => {
    switch (as) {
      case 'nav':
        return 'surface-header'
      case 'section':
        return 'surface-shell'
      default:
        return 'surface-shell'
    }
  }

  // base classes with appropriate surface styling
  const baseClasses = `${getSurfaceClass()} p-8 space-y-8`
  const classes = `${baseClasses} ${className || ''}`

  // common props for all elements
  const commonProps = {
    class: classes,
    ...(id && { id }),
    ...(style && { style }),
  }

  // render based on element type
  switch (as) {
    case 'nav':
      return <nav {...commonProps} role='navigation'>{children}</nav>
    case 'div':
      return <div {...commonProps}>{children}</div>
    case 'section':
    default:
      return <section {...commonProps}>{children}</section>
  }
}
