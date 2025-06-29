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

const baseClass = 'w-full h-12 flex items-center justify-center rounded-[24px] font-medium text-sm transition-colors'

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items (no border, no outline, fade-in)
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {}, action }: Props) => {
  const activeClass = isActive ? 'bg-background-primary text-text-primary font-semibold' : 'bg-transparent text-text-secondary font-medium'

  if (action?.type === 'navigate' && action.href) {
    return (
      <a
        key={id}
        href={action.href}
        className={`${baseClass} ${activeClass}`}
        tabIndex={0}
        f-client-nav
        {...{ style, onClick }}
      >
        {label}
      </a>
    )
  }
  return (
    <button
      key={id}
      className={`${baseClass} ${activeClass}`}
      tabIndex={0}
      type='button'
      {...{ style, onClick }}
    >
      {label}
    </button>
  )
}
