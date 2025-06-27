import { BackIcon, MenuIcon } from '@components/icons/index.ts'
import { CSSProperties } from 'preact/compat'
import type { UITheme } from '@lib/theme/types.ts'
import type { ActionZoneButton } from '@components/actionZone/actionZone.animation.ts'

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
  state: ActionZoneButton
  onAction: (action: ActionZoneButton['action']) => void
  style: CSSProperties
  onMouseEnter: () => void
  onMouseLeave: () => void
  flex?: string
  transformOrigin?: string
  variant?: 'outlined' | 'plain'
  theme?: UITheme
}

/**
 * ActionZoneButton molecule component
 * Combines Icon and BaseButton atoms with animation state management
 * Handles smooth morphing between different navigation roles
 */
export const ActionZoneButton = (
  {
    id, //
    state,
    onAction,
    style,
    onMouseEnter,
    onMouseLeave,
    flex,
    transformOrigin,
    variant = 'outlined',
    theme,
  }: Props,
) => {
  // tailwind's hover: and focus: utilities are safe for touch devices and pointer devices
  // browsers will not trigger these on pure touch devices
  const baseClasses =
    `w-full h-full inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-md gap-2 nav-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0`

  const handleClick = () => {
    if (state.action.type !== 'none') onAction(state.action)
  }

  const showText = state.role === 'nav-item' || state.role === 'page-title'
  const isLink = state.action.type === 'navigate'
  const { icon, label } = state?.content

  // border logic based on variant and role, using theme
  let border = 'none'
  if (variant === 'outlined' && state.role === 'nav-item' && theme) {
    border = `1px solid ${theme.colors.text.tertiary}`
  }

  const filteredStyle = Object.fromEntries(Object.entries(style).filter(([_, v]) => v != null))

  const getIconAndLabel = () => (
    <>
      {icon && (
        <span>
          {icon === 'back' && <BackIcon />}
          {icon === 'menu' && <MenuIcon />}
        </span>
      )}
      {showText && (
        <span>
          {label}
        </span>
      )}
    </>
  )

  return (
    isLink
      ? (
        <a
          id={id}
          href={state.action.href}
          className={`nav-button ${baseClasses}`}
          style={{
            ...filteredStyle,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border,
            flex: flex || '0 0 auto',
            transformOrigin: transformOrigin || 'center',
          }}
          aria-label={state.content.label}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          f-client-nav
          onClick={() => onAction(state.action)}
        >
          {getIconAndLabel()}
        </a>
      )
      : (
        <button
          id={id}
          type='button'
          onClick={handleClick}
          className={`nav-button ${baseClasses}`}
          style={{
            ...filteredStyle,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border,
            flex: flex || '0 0 auto',
            transformOrigin: transformOrigin || 'center',
          }}
          disabled={state.action.type === 'none'}
          aria-label={state.content.label}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {getIconAndLabel()}
        </button>
      )
  )
}
