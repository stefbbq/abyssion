import { useState } from 'preact/hooks'
import type { NavButtonState } from '@utils/navigation/types.ts'
import { UITheme } from '@lib/theme/types.ts'
import { NavButton } from '@molecules/NavButton.tsx'

interface CollapsedNavProps {
  buttons: NavButtonState[]
  onAction: (action: NavButtonState['action']) => void
  theme: UITheme
}

export const CollapsedNav = ({ buttons, onAction, theme }: CollapsedNavProps) => {
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null)

  const getButtonStyles = (state: NavButtonState, isHovered: boolean) => {
    const isActive = state.isActive || state.role === 'page-title'
    const isNavItem = state.role === 'nav-item'
    const baseColor = isActive ? theme.colors.text.primary : 'transparent'
    const textColor = isActive ? theme.colors.background.primary : theme.colors.text.secondary
    const hoverColor = theme.colors.interactive?.ghostHover || theme.colors.background.tertiary

    return {
      height: '50px',
      borderRadius: '25px',
      border: isNavItem ? `1px solid ${theme.colors.text.tertiary || '#666'}` : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      backgroundColor: isHovered && !isActive ? hoverColor : baseColor,
      color: isHovered && !isActive ? theme.colors.text.primary : textColor,
      fontWeight: isActive ? '600' : '500',
      cursor: state.action.type === 'none' ? 'default' : 'pointer',
    }
  }

  return (
    <div class='px-6 h-full'>
      <div class='relative h-full w-full flex items-center gap-2'>
        {buttons.map((buttonState) => (
          <NavButton
            key={buttonState.id}
            id={buttonState.id}
            state={buttonState}
            onAction={onAction}
            style={getButtonStyles(buttonState, hoveredButtonId === buttonState.id)}
            onMouseEnter={() => setHoveredButtonId(buttonState.id)}
            onMouseLeave={() => setHoveredButtonId(null)}
            flex={buttonState.role === 'action-button' || buttonState.role === 'back-button' ? '0 0 auto' : '1 1 0%'}
          />
        ))}
      </div>
    </div>
  )
}
