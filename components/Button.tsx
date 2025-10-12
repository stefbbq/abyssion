// deno-lint-ignore-file no-explicit-any
import { ComponentChildren, JSX, Ref } from 'preact'
import { IS_BROWSER } from '$fresh/runtime.ts'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Base props shared by both button and anchor variants
 */
type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ComponentChildren
  class?: string
  /** enable desktop-only reveal hover overlay effect */
  hoverReveal?: boolean
  /** when true, do not add Fresh partial navigation attribute */
  noPartial?: boolean
}

/**
 * Props for <button> element (no href)
 * @see Button
 */
type ButtonElementProps =
  & Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'size' | 'class' | 'href'>
  & { href?: never; ref?: Ref<HTMLButtonElement> }

/**
 * Props for <a> element (requires href)
 * @see Button
 */
type AnchorElementProps =
  & Omit<JSX.HTMLAttributes<HTMLAnchorElement>, 'size' | 'class'>
  & { href: string; ref?: Ref<HTMLAnchorElement> }

/**
 * Button Props
 * Discriminated union: if href is present, renders <a>; otherwise <button>.
 * TypeScript enforces correct prop usage.
 */
type Props = BaseProps & (ButtonElementProps | AnchorElementProps)

const variantClasses = {
  primary: 'bg-[var(--colors-primary)] text-[var(--colors-background)] hover:bg-[var(--colors-interactive-hover)] border-transparent',
  secondary: 'bg-[var(--colors-secondary)] text-[var(--colors-background)] hover:bg-[var(--colors-interactive-hover)] border-[var(--colors-border-primary)]',
  outline: 'bg-transparent text-[var(--colors-foreground)] hover:bg-[var(--colors-interactive-hover)] border-[var(--colors-border-primary)]',
  ghost: 'bg-transparent text-[var(--colors-foreground)] hover:text-[var(--colors-primary)] hover:bg-[var(--colors-surface)] border-transparent',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-theme-sm',
  md: 'px-4 py-2 text-sm rounded-theme-md',
  lg: 'px-6 py-3 text-base rounded-theme-lg',
}

/**
 * A versatile button component that can render as a standard button
 * or as an anchor tag for navigation, with support for Fresh Partials.
 * Features multiple visual variants and sizes, inspired by Vercel's design system.
 *
 * - Use `variant` for style: 'primary', 'secondary', 'outline', 'ghost'
 * - Use `size` for sizing: 'sm', 'md', 'lg'
 * - If `href` is provided, renders as <a> and enables Fresh partial navigation
 * - All theme classes are applied via CSS variables
 * - Border radius uses theme-aware utilities
 *
 * @example
 *   <Button variant='primary' size='md'>Click me</Button>
 *   <Button href='/about' variant='outline'>About</Button>
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  class: className,
  hoverReveal = false,
  noPartial = false,
  ...props
}: Props) => {
  const baseClasses =
    'inline-flex items-center font-medium uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--colors-interactive-focus)] focus:ring-offset-[var(--colors-background)] disabled:opacity-50 disabled:cursor-not-allowed'
  const justifyClasses = className?.includes('justify-') ? '' : 'justify-center'
  const transitionClasses = 'transition-all duration-200'
  const hoverRevealClasses = hoverReveal
    ? 'group relative overflow-hidden md:hover:shadow-md before:content-["""] before:absolute before:inset-0 before:bg-[var(--colors-foreground)] before:transform before:-translate-x-full md:hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-out before:pointer-events-none before:z-0'
    : ''
  const classes = `${baseClasses} ${justifyClasses} ${transitionClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverRevealClasses} ${
    className || ''
  }`

  // Separate ref from props
  const { ref, ...rest } = props as { ref?: any }

  if (props.href) {
    const href = (props as any).href as string
    const isHashLink = typeof href === 'string' && href.startsWith('#')
    const isExternal = typeof href === 'string' && (/^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:'))
    const wrappedChildren = hoverReveal ? <span class='relative z-10'>{children}</span> : children
    return (
      <a
        {...rest}
        ref={ref as any}
        class={classes}
        {...(isHashLink || isExternal || noPartial ? {} : { 'f-partial': `/partials${href === '/' ? '/home' : href}` })}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {wrappedChildren}
      </a>
    )
  }

  // TypeScript knows these are ButtonElementProps
  const wrappedChildren = hoverReveal ? <span class='relative z-10'>{children}</span> : children
  return (
    <button
      {...rest}
      ref={ref as any}
      class={classes}
      disabled={!IS_BROWSER || props.disabled}
    >
      {wrappedChildren}
    </button>
  )
}
