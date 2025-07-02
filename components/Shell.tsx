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
 *
 * @example
 *   <Shell>Content</Shell>
 */

export const Shell = ({ children, className }: Props) => {
  return (
    <section class={`rounded-2xl shadow-lg p-8 glass-effect ${className || ''}`}>
      {children}
    </section>
  )
}
