import { useState } from 'preact/hooks'
import { ActionZoneButton as ActionZoneButtonComponent } from '@components/actionZone/ActionZoneButton.tsx'
import type { ActionZoneButton } from '@components/actionZone/types.ts'

type Props = {
  buttons: ActionZoneButton[]
  onAction: (action: ActionZoneButton['action']) => void
}

/**
 * ActionZoneCollapsed component
 * Renders navigation buttons for the collapsed ActionZone state.
 * Handles hover and active state for all collapsed navigation buttons.
 * Supports flexible button layout for nav buttons + menu button.
 */
export const ActionZoneCollapsed = ({ buttons, onAction }: Props) => {
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null)

  const navButtons = buttons.filter((b) => b.role === 'nav-item')
  const menuButton = buttons.find((b) => b.role === 'action-button')
  const hoverButtonClasses = 'bg-interactive-ghostHover text-text-primary'
  const defaultButtonClasses = 'bg-transparent text-text-secondary'

  return (
    <div class='w-full flex items-center justify-center gap-1 px-4 h-full'>
      {/* Render nav buttons with equal flex */}
      {navButtons.map((button) => {
        const isHovered = hoveredButtonId === button.id
        const isActive = button.isActive
        const buttonClasses = isHovered && !isActive ? hoverButtonClasses : defaultButtonClasses

        return (
          <ActionZoneButtonComponent
            key={button.id}
            id={button.id}
            state={button}
            onAction={onAction}
            className={buttonClasses}
            style={button.style || {}}
            onMouseEnter={() => setHoveredButtonId(button.id)}
            onMouseLeave={() => setHoveredButtonId(null)}
            flex='1'
            variant='outlined'
          />
        )
      })}

      {/* Render menu button with fixed width */}
      {menuButton && (() => {
        const isHovered = hoveredButtonId === menuButton.id
        const isActive = menuButton.isActive
        const buttonClasses = isHovered && !isActive ? hoverButtonClasses : defaultButtonClasses

        return (
          <ActionZoneButtonComponent
            key={menuButton.id}
            id={menuButton.id}
            state={menuButton}
            onAction={onAction}
            className={buttonClasses}
            style={menuButton.style || {}}
            onMouseEnter={() => setHoveredButtonId(menuButton.id)}
            onMouseLeave={() => setHoveredButtonId(null)}
            flex='0 0 auto'
            variant='outlined'
          />
        )
      })()}
    </div>
  )
}
