import type { NavButtonState } from '@data/types.ts'
import { BackIcon, MenuIcon } from '@atoms/icons/index.ts'
import { motion } from 'framer-motion'
import { CSSProperties } from 'preact/compat'

type Props = {
  id: string
  state: NavButtonState
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
  const getBaseClasses = () =>
    'w-full h-full inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-md gap-2'

  const handleClick = () => {
    if (state.action.type !== 'none') onAction(state.action)
  }

  const showText = state.role === 'nav-item' || state.role === 'page-title'
  const isLink = state.action.type === 'navigate'

  // border logic based on variant and role
  const border = variant === 'outlined' && state.role === 'nav-item'
    ? `1px solid #666` // theme color can be injected via style if needed
    : 'none'

  return (
    <div style={{ flex: flex || '0 0 auto' }}>
      <motion.div
        layoutId={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', height: '100%', transformOrigin: transformOrigin || 'center' }}
      >
        {isLink && (
          <a
            href={state.action.href}
            className={`${getBaseClasses()} nav-button`}
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
            className={`${getBaseClasses()} nav-button`}
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
