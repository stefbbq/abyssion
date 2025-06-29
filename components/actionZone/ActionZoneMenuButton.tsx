import { CSSProperties } from 'preact/compat'
import type { ActionZoneButton } from '@components/actionZone/actionZone.animation.ts'

type Props = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
  style?: CSSProperties
  action: ActionZoneButton['action']
}

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items (no border, no outline, fade-in)
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {}, action }: Props) => {
  const baseClass = 'w-full h-12 flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'
  const activeClass = isActive ? 'bg-background-primary text-text-primary font-semibold' : 'bg-transparent text-text-secondary font-medium'

  if (action?.type === 'navigate' && action.href) {
    return (
      <a
        key={id}
        href={action.href}
        className={`${baseClass} ${activeClass}`}
        style={style}
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
      className={`${baseClass} ${activeClass}`}
      style={style}
      onClick={onClick}
      tabIndex={0}
      type='button'
    >
      {label}
    </button>
  )
}
