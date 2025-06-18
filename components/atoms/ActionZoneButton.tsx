import type { NavButtonState } from '@data/types.ts'
import { BackIcon, MenuIcon } from '@atoms/icons/index.ts'
import { motion } from 'framer-motion'
import { CSSProperties } from 'preact/compat'
// import type { ActionZoneAnimationButton } from '@organisms/ActionZone/configurations/types.ts'

/**
 * ActionZoneButton supports animation prop for config-driven variants.
 *
 * @example
 * <ActionZoneButton animation={...} ... />
 */
type Props = {
  state: any // TODO: replace with correct type if available
  onAction: (action: NavButtonState['action']) => void
  style: CSSProperties
  animation?: any
  onMouseEnter: () => void
  onMouseLeave: () => void
  flex?: string
  transformOrigin?: string
  variant?: 'outlined' | 'plain'
}

/**
 * NavButton molecule component
 * Combines Icon and BaseButton atoms with animation state management
 * Handles smooth morphing between different navigation roles
 */
export const ActionZoneButton = (
  { state, onAction, style, animation, onMouseEnter, onMouseLeave, flex, transformOrigin, variant = 'outlined' }: Props,
) => {
  const isActive = state.isActive || state.role === 'page-title'
  const isNavItem = state.role === 'nav-item'
  const showText = state.role === 'nav-item' || state.role === 'page-title'
  const isLink = state.action.type === 'navigate'
  const isButton = state.action.type !== 'navigate'

  // merge style defaults with incoming style
  const mergedStyle = {
    height: '50px',
    borderRadius: 25,
    border: variant === 'outlined' && isNavItem ? '1px solid #666' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    backgroundColor: isActive ? '#fff' : 'transparent',
    color: isActive ? '#000' : '#fff',
    fontWeight: isActive ? 600 : 500,
    cursor: state.action.type === 'none' ? 'default' : 'pointer',
    ...style,
  }

  const defaultButtonAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const getButtonAnimation = () => animation || state.animation || defaultButtonAnimation

  const onClick = () => {
    if (state.action.type !== 'none') onAction(state.action)
  }

  return (
    <div style={{ flex: flex || '0 0 auto' }}>
      <motion.div
        {...(animation ? animation : {})}
        initial={animation?.initial}
        animate={animation?.animate}
        exit={animation?.exit}
        transition={animation?.transition}
        style={{ width: '100%', height: '100%', transformOrigin: transformOrigin || 'center' }}
      >
        {/* Navigate */}
        {isLink && (
          <a
            href={state.action.href}
            className='nav-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0'
            style={mergedStyle}
            aria-label={state.content.label}
            {...{ onMouseEnter, onMouseLeave }}
            f-client-nav
            onClick={() => onAction(state.action)}
          >
            {state.content.icon && (
              <motion.div layout='position'>
                {state.content.icon === 'back' && <BackIcon />}
                {state.content.icon === 'menu' && <MenuIcon />}
              </motion.div>
            )}
            {showText && <motion.span layout='position'>{state.content.label}</motion.span>}
          </a>
        )}

        {/* Title */}
        {isButton && (
          <button
            className='nav-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0'
            style={mergedStyle}
            disabled={state.action.type === 'none'}
            aria-label={state.content.label}
            {...{ onMouseEnter, onMouseLeave, onClick }}
          >
            {state.content.icon && (
              <motion.div layout='position'>
                {state.content.icon === 'back' && <BackIcon />}
                {state.content.icon === 'menu' && <MenuIcon />}
              </motion.div>
            )}
            {showText && <motion.span layout='position'>{state.content.label}</motion.span>}
          </button>
        )}
      </motion.div>
    </div>
  )
}
