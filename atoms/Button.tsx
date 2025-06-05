import { JSX } from 'preact'
import { IS_BROWSER } from '$fresh/runtime.ts'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
}

/**
 * Vercel-inspired button component with multiple variants and sizes
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

  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={classes}
    >
      {children}
    </button>
  )
}
