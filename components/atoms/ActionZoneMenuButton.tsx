import { CSSProperties } from 'preact/compat'
import type { UITheme } from '@lib/theme/types.ts'
import type { ActionZoneButton } from '@organisms/actionZone.animation.ts'

type Props = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
  style?: CSSProperties
  theme: UITheme
  action: ActionZoneButton['action']
}

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items (no border, no outline, fade-in)
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {}, theme, action }: Props) => {
  // filter out null/undefined values from style
  const filteredStyle = Object.fromEntries(Object.entries(style).filter(([_, v]) => v != null))
  const baseClass = 'w-full h-12 flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'
  const mergedStyle = {
    backgroundColor: isActive ? theme.colors.background.primary : 'transparent',
    color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
    fontWeight: isActive ? 600 : 500,
    border: 'none',
    outline: 'none',
    ...filteredStyle,
  }
  if (action?.type === 'navigate' && action.href) {
    return (
      <a
        key={id}
        href={action.href}
        className={baseClass}
        style={mergedStyle}
        tabIndex={0}
        f-client-nav
      >
        {label}
      </a>
    )
  }
  return (
    <button
      key={id}
      className={baseClass}
      style={mergedStyle}
      onClick={onClick}
      tabIndex={0}
      type='button'
    >
      {label}
    </button>
  )
}
