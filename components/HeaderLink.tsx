import { JSX } from 'preact'

type Props = {
  href: string // link destination
  children: preact.ComponentChildren // link content (text, icon, or both)
  ariaLabel?: string // accessibility label
  className?: string // additional class names
  isActive?: boolean // whether the link is currently active
  compact?: boolean // for icon-only (social) links
  style?: JSX.CSSProperties // inline styles
}

const baseClasses = 'rounded-theme-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus'
const transitionClasses = 'transition-all duration-200'
const textClasses = 'font-medium text-sm text-text-primary'
const hoverClasses = 'hover:bg-interactive-ghostHover'
const activeStateClasses = 'active:bg-interactive-ghostActive active:text-text-inverse'
const paddingClasses = 'p-2'

/**
 * Flexible nav link for the header, supporting text, icon, or both.
 * Applies consistent hover/focus/active styles for both page and social links
 * by referencing CSS variables provided by a parent theme context.
 * Uses theme-aware border radius for consistent styling.
 *
 * @example
 *   <HeaderLink href='/about'>About</HeaderLink>
 *   <HeaderLink href='https://x.com' compact><XIcon /></HeaderLink>
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
  // dynamic classes
  const margin = compact ? 'mx-.5' : 'mx-1.5'
  const activeClass = isActive ? 'bg-interactive-ghostActive text-text-inverse' : ''

  return (
    <a
      aria-label={ariaLabel}
      class={`${baseClasses} ${transitionClasses} ${textClasses} ${hoverClasses} ${activeStateClasses} ${margin} ${paddingClasses} ${activeClass} ${className}`}
      {...{ style, href }}
    >
      {children}
    </a>
  )
}
