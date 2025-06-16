import type { NavButtonState } from '@data/types.ts'
import { BackIcon, MenuIcon } from '@atoms/icons/index.ts'
import { motion } from 'framer-motion'
import { CSSProperties } from 'preact/compat'
import actionZoneAnimationConfig from '@organisms/actionZone.animation.ts'
import type { ActionZoneAnimationButton } from '@organisms/actionZone.animation.ts'

type Props = {
  id: string
  state: ActionZoneAnimationButton
  onAction: (action: NavButtonState['action']) => void
  style: CSSProperties
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
  { id, state, onAction, style, onMouseEnter, onMouseLeave, flex, transformOrigin, variant = 'outlined' }: Props,
) => {
  // tailwind's hover: and focus: utilities are safe for touch devices and pointer devices
  // browsers will not trigger these on pure touch devices
  const getBaseClasses = () =>
    `w-full h-full inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-md gap-2 nav-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0`

  const handleClick = () => {
    if (state.action.type !== 'none') onAction(state.action)
  }

  const showText = state.role === 'nav-item' || state.role === 'page-title'
  const isLink = state.action.type === 'navigate'

  // border logic based on variant and role
  const border = variant === 'outlined' && state.role === 'nav-item'
    ? `1px solid #666` // theme color can be injected via style if needed
    : 'none'

  // helper to get the correct animation variant for this button
  const getButtonAnimation = () => state.animation || actionZoneAnimationConfig.buttonVariants

  return (
    <div style={{ flex: flex || '0 0 auto' }}>
      <motion.div
        layoutId={id}
        initial={getButtonAnimation().initial}
        animate={getButtonAnimation().animate}
        exit={getButtonAnimation().exit}
        transition={undefined}
        style={{ width: '100%', height: '100%', transformOrigin: transformOrigin || 'center' }}
      >
        {isLink && (
          <a
            href={state.action.href}
            className={`${state.buttonClassNames || getBaseClasses()} nav-button`}
            style={{ ...style, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border }}
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
        {!isLink && (
          <button
            onClick={handleClick}
            className={`${state.buttonClassNames || getBaseClasses()} nav-button`}
            style={{ ...style, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border }}
            disabled={state.action.type === 'none'}
            aria-label={state.content.label}
            {...{ onMouseEnter, onMouseLeave }}
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
