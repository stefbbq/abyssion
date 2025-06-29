import { BackIcon, MenuIcon } from '@components/icons/index.ts'
import { CSSProperties } from 'preact/compat'
import type { ActionZoneButton as ActionZoneButtonConfig } from '@components/actionZone/actionZone.animation.ts'

// Use a local type for the button prop
export type ActionZoneButtonType = {
  id: string
  key: string
  role: string
  content: { label: string; icon?: string }
  position: string
  action: { type: string; href?: string }
  isActive?: boolean
  flex?: string
  style?: Record<string, string | number>
}

type Props = {
  id: string
  state: ActionZoneButtonConfig
  onAction: (action: ActionZoneButtonConfig['action']) => void
  style: CSSProperties
  onMouseEnter: () => void
  onMouseLeave: () => void
  className?: string
  flex?: string
  transformOrigin?: string
  variant?: 'outlined' | 'plain'
}

/**
 * ActionZoneButton molecule component
 * Combines Icon and BaseButton atoms with animation state management
 * Handles smooth morphing between different navigation roles
 */
export const ActionZoneButton = (
  {
    id,
    state,
    onAction,
    style,
    onMouseEnter,
    onMouseLeave,
    className,
    flex,
    transformOrigin,
    variant = 'outlined',
  }: Props,
) => {
  // tailwind's hover: and focus: utilities are safe for touch devices and pointer devices
  // browsers will not trigger these on pure touch devices
  const baseClasses =
    'w-full h-full inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-md gap-2 nav-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0'

  const handleClick = () => {
    if (state.action.type !== 'none') onAction(state.action)
  }

  const showText = state.role === 'nav-item' || state.role === 'page-title'
  const isLink = state.action.type === 'navigate'
  const { icon, label } = state?.content

  const borderClass = (variant === 'outlined' && state.role === 'nav-item') ? 'border border-text-tertiary' : 'border-none'

  const getIconAndLabel = () => (
    <>
      {icon && (
        <span>
          {icon === 'back' && <BackIcon />}
          {icon === 'menu' && <MenuIcon />}
        </span>
      )}
      {showText && <span>{label}</span>}
    </>
  )

  const commonProps = {
    id,
    className: `${baseClasses} ${borderClass} ${className || ''}`,
    style: {
      ...style,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: flex || '0 0 auto',
      transformOrigin: transformOrigin || 'center',
    },
    onMouseEnter,
    onMouseLeave,
    'aria-label': state.content.label,
  }

  if (isLink) {
    return (
      <a
        {...commonProps}
        href={state.action.href}
        f-client-nav
        onClick={() => onAction(state.action)}
      >
        {getIconAndLabel()}
      </a>
    )
  }

  return (
    <button
      {...commonProps}
      type='button'
      onClick={handleClick}
      disabled={state.action.type === 'none'}
    >
      {getIconAndLabel()}
    </button>
  )
}
