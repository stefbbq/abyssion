import { JSX } from 'preact'

/**
 * HeaderLink - a flexible nav link for the header, supporting text, icon, or both.
 * Applies consistent hover/focus/active styles for both page and social links
 * by referencing CSS variables provided by a parent theme context.
 */
export type HeaderLinkProps = {
  href: string
  children: preact.ComponentChildren
  ariaLabel?: string
  className?: string
  isActive?: boolean
  compact?: boolean // for icon-only (social) links
  style?: JSX.CSSProperties
}

export const HeaderLink = ({
  href,
  children,
  ariaLabel,
  className = '',
  isActive = false,
  compact = false,
  style = {},
}: HeaderLinkProps) => {
  // Base styles, consistent for all links
  const base = 'rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  // Theme-driven styles using CSS variables
  const text = 'font-medium text-sm text-[var(--colors-text-primary)]'
  const hover = 'hover:bg-[var(--colors-interactive-ghostHover)]'
  const focus = 'focus-visible:ring-[var(--colors-border-focus)]'
  const active = 'active:bg-[var(--colors-interactive-ghostActive)] active:text-[var(--colors-text-inverse)]'

  // Spacing for compact (icon-only) links
  const margin = compact ? 'mx-1' : 'mx-0'
  const padding = compact ? 'p-2' : 'px-3 py-2'

  // Styles for the currently active page link
  const activeClass = isActive ? 'bg-[var(--colors-interactive-ghostActive)] text-[var(--colors-text-inverse)]' : ''

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      class={`${base} ${text} ${hover} ${focus} ${active} ${margin} ${padding} ${activeClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </a>
  )
}
