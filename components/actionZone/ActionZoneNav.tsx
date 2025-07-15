import { useState } from 'preact/hooks'
import { ActionZoneButton as ActionZoneButtonComponent } from '@components/actionZone/ActionZoneButton.tsx'
import type { ActionZoneButton } from '@components/actionZone/types.ts'

type Props = {
  buttons: ActionZoneButton[]
  onAction: (action: ActionZoneButton['action']) => void
}

/**
 * ActionZoneNav component
 * Renders navigation buttons for the ActionZone, handling hover and active state.
 * Now supports flexible button layout for all nav buttons + menu button.
 */
export const ActionZoneNav = ({ buttons, onAction }: Props) => {
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null)

  // Separate nav buttons from menu button for proper layout
  const navButtons = buttons.filter((b) => b.role === 'nav-item')
  const menuButton = buttons.find((b) => b.role === 'action-button')

  return (
    <div class='w-full flex items-center justify-center gap-1 px-4 h-full'>
      {/* Render nav buttons with equal flex */}
      {navButtons.map((button) => {
        const isHovered = hoveredButtonId === button.id
        const isActive = button.isActive
        const isMenuButton = button.role === 'action-button'

        // Active state: use theme colors (white bg, black text in dark mode)
        let buttonClasses = ''
        if (isActive && !isMenuButton) {
          buttonClasses = 'bg-background-primary text-text-primary'
        } else if (isHovered && !isActive) {
          buttonClasses = 'bg-interactive-ghostHover text-text-primary'
        } else {
          buttonClasses = 'bg-transparent text-text-secondary'
        }

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
        const isMenuButton = menuButton.role === 'action-button'

        // Menu button styling
        let buttonClasses = ''
        if (isHovered && !isActive) {
          buttonClasses = 'bg-interactive-ghostHover text-text-primary'
        } else {
          buttonClasses = 'bg-transparent text-text-secondary'
        }

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
