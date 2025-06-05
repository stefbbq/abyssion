interface BaseButtonProps {
  children: any
  onClick?: () => void
  href?: string
  className?: string
  style?: any
  disabled?: boolean
  'aria-label'?: string
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
}

/**
 * BaseButton atom component
 * Handles both button and anchor tag rendering with Fresh Partials support
 * Automatically uses Fresh Partials for href navigation
 */
export const BaseButton = ({
  children,
  onClick,
  href,
  className,
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}: BaseButtonProps) => {
  const commonProps = {
    class: className,
    style,
    disabled,
    onMouseEnter,
    onMouseLeave,
    ...props,
  }

  if (href) {
    return (
      <a
        {...commonProps}
        href={href}
        f-partial={`/partials${href === '/' ? '/home' : href}`}
      >
        {children}
      </a>
    )
  }

  return (
    <button {...commonProps} onClick={onClick}>
      {children}
    </button>
  )
}
