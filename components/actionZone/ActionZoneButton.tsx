import { BackIcon, MenuIcon } from '@components/icons/index.ts'
import { CSSProperties } from 'preact/compat'
import type { ActionZoneButton as ActionZoneButtonConfig } from './types.ts'

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
 * Uses theme-aware border radius for consistent styling
 */
// role style configuration type
type RoleStyle = {
  base: string
  hover?: string
  colors?: string
  border: string
}

// role-based styling configurations
const roleStyles: Record<string, RoleStyle> = {
  'nav-item': {
    base: 'h-10 px-3 py-1.5 text-sm font-medium rounded-theme-full',
    hover: 'hover:bg-interactive-ghostHover',
    border: 'border border-text-tertiary',
  },
  'page-title': {
    base: 'h-10 px-3 py-1.5 text-sm font-normal lowercase rounded-theme-full',
    colors: 'bg-foreground text-background',
    border: 'border-none',
  },
  'action-button': {
    base: 'h-10 w-10 p-0 rounded-theme-full',
    hover: 'hover:bg-interactive-ghostHover',
    border: 'border-none',
  },
  'back-button': {
    base: 'h-10 w-10 p-0 rounded-theme-full',
    hover: 'hover:bg-interactive-ghostHover',
    border: 'border-none',
  },
}

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
  const { action: { type }, role, content: { label, icon } } = state

  // base classes shared by all buttons
  const baseClasses =
    'inline-flex items-center justify-center disabled:cursor-not-allowed gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0'

  // get role-specific styling
  const roleStyle = roleStyles[role] || roleStyles['nav-item']
  const showText = role === 'nav-item' || role === 'page-title'
  const isLink = type === 'navigate'

  // build complete class string
  const borderClass = (variant === 'outlined' && role === 'nav-item') ? roleStyle.border : 'border-none'
  const colorClass = role === 'page-title' ? roleStyle.colors || '' : ''
  const hoverClass = roleStyle.hover || ''

  // only call onAction if the action is not 'none'
  const handleClick = () => type !== 'none' && onAction(state.action)

  // get the icon and label for the button
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
    className: `${baseClasses} ${roleStyle.base} ${borderClass} ${colorClass} ${hoverClass} ${className || ''}`,
    style: {
      ...style,
      flex: flex || (role === 'page-title' ? '1 1 0%' : '0 0 auto'),
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
