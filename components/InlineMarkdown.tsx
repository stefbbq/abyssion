import type { JSX } from 'preact'
import { render as renderGfm } from 'https://deno.land/x/gfm@0.2.4/mod.ts'

type Props = {
  children: string
  as?: keyof JSX.IntrinsicElements
  className?: string
}

/**
 * inline markdown
 * renders markdown to HTML using the same GFM pipeline as TextBlock, then
 * strips a single outer <p> wrapper for inline safety. uses a localized
 * lint ignore for the single dangerous html injection.
 */
export const InlineMarkdown = ({ children, as = 'span', className }: Props) => {
  const preprocess = (value: string): string => value.replace(/([^\n])\n(?!\n)/g, '$1<br>\n')
  const html = renderGfm(preprocess(children))
  const singleP = html.startsWith('<p>') && html.endsWith('</p>') && html.slice(3, -4).indexOf('<p>') === -1
  const inlineHtml = singleP ? html.slice(3, -4) : html

  const Tag = as as keyof JSX.IntrinsicElements
  return (
    <Tag
      className={className}
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: inlineHtml }}
    />
  )
}
