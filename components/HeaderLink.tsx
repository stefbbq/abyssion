import { JSX } from 'preact'

type Props = {
  href: string
  children: preact.ComponentChildren
  ariaLabel?: string
  className?: string
  isActive?: boolean
  compact?: boolean // for icon-only (social) links
  style?: JSX.CSSProperties
}

/**
 * Flexible nav link for the header, supporting text, icon, or both.
 * Applies consistent hover/focus/active styles for both page and social links
 * by referencing CSS variables provided by a parent theme context.
 */
export const HeaderLink = ({
  href,
  children,
  ariaLabel,
  className = '',
  isActive = false,
  compact = false,
  style = {},
}: Props) => {
  // Spacing for compact (icon-only) links
  const margin = compact ? 'mx-.5' : 'mx-1.5'

  // Styles for the currently active page link
  const activeClass = isActive ? 'bg-interactive-ghostActive text-text-inverse' : ''

  const baseClasses =
    'rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus'
  const textClasses = 'font-medium text-sm text-text-primary'
  const hoverClasses = 'hover:bg-interactive-ghostHover'
  const activeStateClasses = 'active:bg-interactive-ghostActive active:text-text-inverse'
  const paddingClasses = 'p-2'

  return (
    <a
      aria-label={ariaLabel}
      class={`${baseClasses} ${textClasses} ${hoverClasses} ${activeStateClasses} ${margin} ${paddingClasses} ${activeClass} ${className}`
        .trim()}
      {...{ style, href }}
    >
      {children}
    </a>
  )
}
