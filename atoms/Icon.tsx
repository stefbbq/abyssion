interface IconProps {
  type: 'back' | 'menu' | null
  className?: string
}

/**
 * Icon atom component
 * Renders SVG icons for navigation elements
 */
export const Icon = ({ type, className }: IconProps) => {
  if (!type) return null

  const iconClass = `w-5 h-5 ${className || ''}`

  switch (type) {
    case 'back':
      return (
        <svg class={iconClass} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      )
    case 'menu':
      return (
        <svg class={iconClass} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
        </svg>
      )
    default:
      return null
  }
}
