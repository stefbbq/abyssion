import { ComponentChildren } from 'preact'

type Props = {
  children: ComponentChildren
  // optional class names for the outer h2
  className?: string
  // optional class names for the inner span
  innerClassName?: string
}

/**
 * Title component
 * provides consistent h2 styling with a themed surface label and default spacing
 */
export const Title = ({ children, className, innerClassName }: Props) => {
  /**
   * Title component
   * provides consistent h2 styling with a themed surface label and default spacing
   *
   * @param children content to render inside the title
   * @param className optional class names for the outer h2
   * @param innerClassName optional class names for the inner span
   *
   * @example
   *   <Title className='mb-6'>Shows</Title>
   */
  const outer = className || ''
  const inner = `surface-title py-1 uppercase tracking-wider ${innerClassName || ''}`

  // no glitch effect: no data-text needed

  return (
    <div class='-m-8 mb-0 px-8 py-8' style={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
      <h2
        class={outer.trim()}
        style={{
          fontFamily: 'var(--typography-heading-fontFamily)',
          fontSize: 'var(--typography-heading-fontSize)',
          fontWeight: 'var(--typography-heading-fontWeight)',
          lineHeight: 'var(--typography-heading-lineHeight)',
          letterSpacing: 'var(--typography-heading-letterSpacing)',
          fontStyle: 'var(--typography-heading-fontStyle)',
        }}
      >
        <span class={inner.trim()}>{children}</span>
      </h2>
    </div>
  )
}
