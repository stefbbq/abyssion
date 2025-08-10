import { ComponentChildren } from 'preact'

// title component for consistent h2 styling across the app
// wraps text in a themed surface label and applies default sizing/margins

type Props = {
  children: ComponentChildren
  // optional class names for the outer h2
  className?: string
  // optional class names for the inner span
  innerClassName?: string
}

export const Title = ({ children, className, innerClassName }: Props) => {
  const outer = `text-3xl mb-8 ${className || ''}`
  const inner = `surface-title py-1 uppercase tracking-wider ${innerClassName || ''}`

  return (
    <div class='-mx-8 -mt-8 pt-8 px-8' style={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
      <h2 class={outer.trim()}>
        <span class={inner.trim()}>{children}</span>
      </h2>
    </div>
  )
}
