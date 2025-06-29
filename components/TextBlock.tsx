import { ComponentChildren } from 'preact'

/**
 * TextBlock component
 * Renders a block of text with theme-aware color and spacing.
 * Use for paragraphs, prose, or any text content that needs consistent theming.
 *
 * @param children - The text or elements to render
 * @param variant - The color variant: 'primary' | 'secondary' | 'tertiary' (default: 'secondary')
 */
type TextBlockProps = {
  children: ComponentChildren
  variant?: 'primary' | 'secondary' | 'tertiary'
  className?: string
}

export const TextBlock = ({ children, variant = 'secondary', className }: TextBlockProps) => {
  // map variant to theme-aware text color class
  const colorMap = {
    primary: 'text-[var(--colors-text-primary)]',
    secondary: 'text-[var(--colors-text-secondary)]',
    tertiary: 'text-[var(--colors-text-tertiary)]',
  }
  const colorClass = colorMap[variant] || colorMap.secondary

  return (
    <div class={`prose prose-lg max-w-none ${colorClass} ${className || ''}`}>
      {children}
    </div>
  )
}
