import { render } from 'https://deno.land/x/gfm@0.2.4/mod.ts'

/**
 * TextBlock component
 * Renders a block of Markdown text with theme-aware color and spacing.
 * Use for paragraphs, prose, or any text content that needs consistent theming.
 *
 * @param children - The Markdown string to render
 * @param variant - The color variant: 'primary' | 'secondary' | 'tertiary' (default: 'secondary')
 * @param className - Additional class names for the container
 */
type Props = {
  children: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  className?: string
}

export const TextBlock = ({ children, variant = 'secondary', className }: Props) => {
  const colorMap = {
    primary: 'text-[var(--colors-text-primary)]',
    secondary: 'text-[var(--colors-text-secondary)]',
    tertiary: 'text-[var(--colors-text-tertiary)]',
  }
  const colorClass = colorMap[variant] || colorMap.secondary

  // preprocess: convert single newlines to <br> tags, preserve double newlines
  const withBreaks = children.replace(/([^\n])\n(?!\n)/g, '$1<br>\n')
  const html = render(withBreaks)

  return (
    <div
      class={`prose prose-lg max-w-none ${colorClass} [&_p]:mb-3 [&_blockquote_p]:mb-1 [&_blockquote]:mt-6 ${className || ''}`}
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
