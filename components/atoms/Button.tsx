// deno-lint-ignore-file no-explicit-any
import { ComponentChildren, JSX, Ref } from 'preact'
import { IS_BROWSER } from '$fresh/runtime.ts'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Base props common to both button and anchor variations
type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ComponentChildren
  class?: string
}

// Props specific to the <button> element, without 'href'
type ButtonElementProps =
  & Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'size' | 'class' | 'href'>
  & { href?: never; ref?: Ref<HTMLButtonElement> }

// Props specific to the <a> element, requiring 'href'
type AnchorElementProps =
  & Omit<JSX.HTMLAttributes<HTMLAnchorElement>, 'size' | 'class'>
  & { href: string; ref?: Ref<HTMLAnchorElement> }

// Use a discriminated union type. Based on whether 'href' is provided,
// TypeScript will enforce either Button-specific or Anchor-specific props.
export type ButtonProps = BaseProps & (ButtonElementProps | AnchorElementProps)

/**
 * A versatile button component that can render as a standard button
 * or as an anchor tag for navigation, with support for Fresh Partials.
 * It features multiple visual variants and sizes, inspired by Vercel's design system.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  class: className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-500 border border-transparent',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200',
    outline: 'bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-transparent',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`

  // Separate ref from props
  const { ref, ...rest } = props as { ref?: any }

  if (props.href) {
    // TypeScript now knows these are AnchorElementProps
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
