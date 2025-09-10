import { render } from 'https://deno.land/x/gfm@0.2.4/mod.ts'

type Props = {
  // the Markdown string to render
  children: string
  // the color variant (default: 'secondary')
  variant?: 'primary' | 'secondary' | 'tertiary'
  // additional class names for the container
  className?: string
}

/**
 * TextBlock component
 * Renders a block of Markdown text with theme-aware color and spacing.
 * Use for paragraphs, prose, or any text content that needs consistent theming.
 *
 * @example
 *   <TextBlock variant='primary'># Hello</TextBlock>
 */
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
      class={`prose prose-lg max-w-none ${colorClass} [&_p]:mb-3 [&_blockquote_p]:mb-1 [&_blockquote]:mt-6 [&_a]:inline-block [&_a]:no-underline [&_a]:rounded-theme-sm [&_a]:px-1 [&_a]:py-0 [&_a]:transition-colors [&_a]:duration-200 [&_a]:bg-[color-mix(in_srgb,_var(--colors-foreground)_16%,_transparent)] [&_a:hover]:bg-[color-mix(in_srgb,_var(--colors-foreground)_26%,_transparent)] [&_a:active]:bg-[color-mix(in_srgb,_var(--colors-foreground)_32%,_transparent)] [&_a:focus]:outline-none [&_a:focus]:ring-2 [&_a:focus]:ring-offset-2 [&_a:focus]:ring-[var(--colors-interactive-focus)] [&_a:focus]:ring-offset-[var(--colors-background)] ${
        className || ''
      }`}
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
