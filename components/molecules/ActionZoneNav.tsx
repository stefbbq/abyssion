import { useState } from 'preact/hooks'
import type { UITheme } from '@lib/theme/types.ts'
import { ActionZoneButton as ActionZoneButtonComponent } from '@atoms/ActionZoneButton.tsx'
import type { ActionZoneButton } from '@organisms/actionZone.animation.ts'

// Utility to merge style objects
function mergeStyles(base: Record<string, string | number>, overrides: Record<string, string | number>) {
  return { ...base, ...overrides }
}

type Props = {
  buttons: ActionZoneButton[]
  onAction: (action: ActionZoneButton['action']) => void
  theme: UITheme
}

export const ActionZoneNav = ({ buttons, onAction, theme }: Props) => {
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null)

  // Map positions to slots
  const slots = ['left', 'center', 'right']
  // For each slot, find the button and its config style
  const slotButtons = slots.map((slot) => {
    const button = buttons.find((b) => b.position === slot)
    return button
  })

  return (
    <div class='w-full flex items-center gap-2 px-6 h-full'>
      {slotButtons.map((button, idx) => {
        if (button) {
          const isActive = button.isActive || button.role === 'page-title'
          const isHovered = hoveredButtonId === button.id
          const isPageTitle = button.role === 'page-title'
          // Theme-based color logic
          const baseColor = isActive ? (isPageTitle ? theme.colors.text.primary : theme.colors.text.primary) : 'transparent'
          const textColor = isActive
            ? (isPageTitle ? theme.colors.background.primary : theme.colors.background.primary)
            : theme.colors.text.secondary
          const hoverColor = theme.colors.interactive?.ghostHover || theme.colors.background.tertiary
          // Merge config style with theme overrides
          const style = mergeStyles(
            button.style || {},
            {
              backgroundColor: isHovered && !isActive ? hoverColor : baseColor,
              color: isHovered && !isActive ? theme.colors.text.primary : textColor,
              cursor: button.action.type === 'none' ? 'default' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
            },
          )
          return (
            <ActionZoneButtonComponent
              key={button.id}
              id={button.id}
              state={button}
              onAction={onAction}
              style={style}
              onMouseEnter={() => setHoveredButtonId(button.id)}
              onMouseLeave={() => setHoveredButtonId(null)}
              flex={button.flex}
              variant='outlined'
              theme={theme}
            />
          )
        } else {
          // Use the style from the config for this slot type
          // left: backButtonStyle or navItemStyle, center: pageTitleStyle or navItemStyle, right: actionButtonStyle
          let placeholderStyle: Record<string, string | number> = {}
          if (idx === 0) placeholderStyle = { width: '56px', flex: '0 0 56px', minWidth: 0, flexShrink: 0, height: '50px' }
          if (idx === 1) placeholderStyle = { flex: '1 1 0%', flexShrink: 1, height: '50px' }
          if (idx === 2) placeholderStyle = { width: '56px', flex: '0 0 56px', minWidth: 0, flexShrink: 0, height: '50px' }
          return (
            <div
              key={slots[idx]}
              style={{ ...placeholderStyle, opacity: 0, pointerEvents: 'none' }}
            />
          )
        }
      })}
    </div>
  )
}
