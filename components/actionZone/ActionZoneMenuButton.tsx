import { CSSProperties } from 'preact/compat'
import type { ActionZoneButton } from './types.ts'

type Props = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
  style?: CSSProperties
  action: ActionZoneButton['action']
}

const baseClass = 'w-full h-10 flex items-center justify-center rounded-theme-xl font-medium text-sm transition-colors'

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items with proper active state styling
 * Uses theme-aware border radius for consistent styling
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {}, action }: Props) => {
  const activeClass = isActive
    ? 'bg-background-primary text-text-primary font-semibold'
    : 'bg-transparent text-text-secondary font-medium hover:bg-interactive-ghostHover hover:text-text-primary'

  const handleClick = (e?: Event) => {
    if (action.type === 'navigate' && action.href?.startsWith('#')) {
      e?.preventDefault()
    }
    onClick()
  }

  if (action?.type === 'navigate' && action.href) {
    return (
      <a
        key={id}
        href={action.href}
        className={`${baseClass} ${activeClass}`}
        tabIndex={0}
        f-client-nav={false}
        onClick={handleClick}
        style={style}
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
      onClick={handleClick}
      style={style}
    >
      {label}
    </button>
  )
}
