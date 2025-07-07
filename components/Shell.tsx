import { ComponentChildren } from 'preact'

type Props = {
  // section content
  children: ComponentChildren
  // additional class names
  className?: string
}

/**
 * Shell component
 * Provides a rounded, glass-effect section container for content.
 * Theming and layout are handled via CSS variables and utility classes.
 * Uses theme-aware border radius for consistent styling.
 *
 * @example
 *   <Shell>Content</Shell>
 */

export const Shell = ({ children, className }: Props) => {
  return (
    <section class={`surface-shell p-8 ${className || ''}`}>
      {children}
    </section>
  )
}
