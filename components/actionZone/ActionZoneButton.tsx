import { BackIcon, MenuIcon } from '@components/icons/index.ts'
import { CSSProperties } from 'preact/compat'
import { Button } from '@components/Button.tsx'
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
 * Uses the unified Button component with role-specific styling and behavior
 * Handles smooth morphing between different navigation roles
 * Uses theme-aware border radius for consistent styling
 */

// simple role-specific style overrides
const getRoleClasses = (role: string, variant: string) => {
  const baseOverrides = 'h-10 transition-all duration-200'

  switch (role) {
    case 'nav-item': {
      const border = variant === 'outlined' ? 'border border-text-tertiary' : 'border-none'
      return `${baseOverrides} px-3 py-1.5 text-sm font-medium rounded-theme-full ${border}`
    }

    case 'page-title':
      return `${baseOverrides} px-3 py-1.5 text-sm font-normal lowercase rounded-theme-full border-none bg-foreground text-background`

    case 'action-button':
    case 'back-button':
      return `${baseOverrides} w-10 p-0 rounded-theme-full border-none`

    default:
      return `${baseOverrides} px-3 py-1.5 text-sm font-medium rounded-theme-full`
  }
}

export const ActionZoneButton = ({
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
}: Props) => {
  const { action: { type }, role, content: { label, icon }, isActive } = state

  const showText = role === 'nav-item' || role === 'page-title'

  // only call onAction if the action is not 'none'
  const handleClick = (e?: Event) => {
    if (type === 'navigate' && state.action.href?.startsWith('#')) {
      e?.preventDefault()
    }
    if (type !== 'none') {
      onAction(state.action)
    }
  }

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

  // role-specific classes
  const roleClasses = getRoleClasses(role, variant)
  const combinedClasses = `${roleClasses} ${className || ''}`

  // determine Button variant based on role
  const buttonVariant = role === 'page-title' ? 'primary' : 'ghost'

  // handle active state with inline styles (higher specificity than classes)
  const activeStyle = isActive && role === 'nav-item'
    ? {
      backgroundColor: 'var(--colors-foreground)',
      color: 'var(--colors-background)',
    }
    : {}

  const buttonProps = {
    id,
    class: combinedClasses,
    style: {
      ...style,
      ...activeStyle,
      flex: flex || (role === 'page-title' ? '1 1 0%' : '0 0 auto'),
      transformOrigin: transformOrigin || 'center',
    },
    onMouseEnter,
    onMouseLeave,
    onClick: handleClick,
    disabled: state.action.type === 'none',
    'aria-label': state.content.label,
  }

  return (
    <Button
      {...buttonProps}
      variant={buttonVariant}
      size='sm'
    >
      {getIconAndLabel()}
    </Button>
  )
}
