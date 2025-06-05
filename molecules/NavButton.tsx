import { useState } from 'preact/hooks'
import { Icon } from '../atoms/Icon.tsx'
import { BaseButton } from '../atoms/BaseButton.tsx'

interface NavButtonState {
  position: { x: number; width: number }
  role: 'nav-item' | 'page-title' | 'back' | 'menu'
  content: { label: string; icon?: 'back' | 'menu' | null }
  action: { type: 'navigate' | 'back' | 'menu' | 'none'; href?: string }
  isActive: boolean
}

interface NavButtonProps {
  id: string
  state: NavButtonState
  onAction: (action: NavButtonState['action']) => void
  theme: any
}

/**
 * NavButton molecule component
 * Combines Icon and BaseButton atoms with animation state management
 * Handles smooth morphing between different navigation roles
 */
export const NavButton = ({ id, state, onAction, theme }: NavButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const getButtonStyles = () => {
    const isActive = state.isActive || state.role === 'page-title'
    const baseColor = isActive ? theme.colors.text.primary : 'transparent'
    const textColor = isActive ? theme.colors.background.primary : theme.colors.text.secondary
    const hoverColor = theme.colors.interactive?.ghostHover || theme.colors.background.tertiary

    return {
      position: 'absolute',
      left: `${state.position.x}px`,
      width: `${state.position.width}px`,
      height: '48px',
      backgroundColor: isHovered && !isActive ? hoverColor : baseColor,
      color: isHovered && !isActive ? theme.colors.text.primary : textColor,
      borderRadius: '24px',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: isActive ? '600' : '500',
      fontSize: '14px',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: state.action.type === 'none' ? 'default' : 'pointer',
      top: '16px',
    }
  }

  const handleClick = () => {
    if (state.action.type !== 'none') {
      onAction(state.action)
    }
  }

  const showText = state.role === 'nav-item' || state.role === 'page-title'

  return (
    <BaseButton
      onClick={handleClick}
      href={state.action.type === 'navigate' ? state.action.href : undefined}
      className='nav-button'
      style={getButtonStyles()}
      disabled={state.action.type === 'none'}
      aria-label={state.content.label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon type={state.content.icon || null} />
      {showText && (
        <span
          class='button-text transition-all duration-600 ease-out'
          style={{
            marginLeft: state.content.icon ? '8px' : '0',
            opacity: showText ? 1 : 0,
          }}
        >
          {state.content.label}
        </span>
      )}
    </BaseButton>
  )
}

// export the types for use in other components
export type { NavButtonProps, NavButtonState }
