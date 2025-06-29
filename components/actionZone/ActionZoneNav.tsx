import { useState } from 'preact/hooks'
import { ActionZoneButton as ActionZoneButtonComponent } from '@components/actionZone/ActionZoneButton.tsx'
import type { ActionZoneButton } from '@components/actionZone/actionZone.animation.ts'

type Props = {
  buttons: ActionZoneButton[]
  onAction: (action: ActionZoneButton['action']) => void
}

export const ActionZoneNav = ({ buttons, onAction }: Props) => {
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null)

  const slots = ['left', 'center', 'right']
  const slotButtons = slots.map((slot) => buttons.find((b) => b.position === slot))

  return (
    <div class='w-full flex items-center gap-2 px-6 h-full'>
      {slotButtons.map((button, idx) => {
        if (button) {
          const isPageTitle = button.role === 'page-title'
          const isHovered = hoveredButtonId === button.id
          const isActive = button.isActive || isPageTitle

          let buttonClasses = ''
          if (isActive) {
            buttonClasses += isPageTitle ? 'bg-text-primary text-background-primary' : 'bg-text-primary text-background-primary'
          } else {
            buttonClasses += 'bg-transparent text-text-secondary'
          }

          if (isHovered && !isActive) {
            buttonClasses = 'bg-interactive-ghostHover text-text-primary'
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
              flex={button.flex}
              variant='outlined'
            />
          )
        } else {
          let placeholderStyle: Record<string, string | number> = {}
          if (idx === 0) placeholderStyle = { width: '56px', flex: '0 0 56px' }
          if (idx === 1) placeholderStyle = { flex: '1 1 0%' }
          if (idx === 2) placeholderStyle = { width: '56px', flex: '0 0 56px' }
          return <div key={slots[idx]} style={{ ...placeholderStyle, height: '50px' }} />
        }
      })}
    </div>
  )
}
