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
  primary: 'bg-interactive-primary text-text-inverse hover:bg-interactive-primaryHover border-transparent',
  secondary: 'bg-interactive-secondary text-text-primary hover:bg-interactive-secondaryHover border-border-primary',
  outline: 'bg-transparent text-text-primary hover:bg-interactive-ghostHover border-border-primary',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-interactive-ghostHover border-transparent',
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
  ...props
}: Props) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed'
  const transitionClasses = 'transition-all duration-200'
  const classes = `${baseClasses} ${transitionClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`

  // Separate ref from props
  const { ref, ...rest } = props as { ref?: any }

  if (props.href) {
    return (
      <a
        {...rest}
        ref={ref as any}
        class={classes}
        f-partial={`/partials${props.href === '/' ? '/home' : props.href}`}
      >
        {children}
      </a>
    )
  }

  // TypeScript knows these are ButtonElementProps
  return (
    <button
      {...rest}
      ref={ref as any}
      class={classes}
      disabled={!IS_BROWSER || props.disabled}
    >
      {children}
    </button>
  )
}
