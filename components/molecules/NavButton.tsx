import type { NavButtonState } from '@data/types.ts'
import { Icon } from '@atoms/Icon.tsx'
import { motion } from 'framer-motion'
import { CSSProperties } from 'preact/compat'

interface NavButtonProps {
  id: string
  state: NavButtonState
  onAction: (action: NavButtonState['action']) => void
  style: CSSProperties
  onMouseEnter: () => void
  onMouseLeave: () => void
  flex?: string
  transformOrigin?: string
}

/**
 * NavButton molecule component
 * Combines Icon and BaseButton atoms with animation state management
 * Handles smooth morphing between different navigation roles
 */
export const NavButton = ({ id, state, onAction, style, onMouseEnter, onMouseLeave, flex, transformOrigin }: NavButtonProps) => {
  const getBaseClasses = () =>
    'w-full h-full inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-md gap-2'

  const handleClick = () => {
    if (state.action.type !== 'none') {
      onAction(state.action)
    }
  }

  const showText = state.role === 'nav-item' || state.role === 'page-title'
  const isLink = state.action.type === 'navigate'

  return (
    <div style={{ flex: flex || '0 0 auto' }}>
      <motion.div
        layoutId={id}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 } }}
        exit={{ opacity: 0, scaleX: 0.5, transition: { duration: 0.2 } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', height: '100%', transformOrigin: transformOrigin || 'center' }}
      >
        {isLink && (
          <a
            href={state.action.href}
            className={`${getBaseClasses()} nav-button`}
            style={style}
            aria-label={state.content.label}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            f-client-nav
          >
            {state.content.icon && (
              <motion.div layout='position'>
                <Icon type={state.content.icon} />
              </motion.div>
            )}
            {showText && <motion.span layout='position'>{state.content.label}</motion.span>}
          </a>
        )}
        {!isLink && (
          <button
            onClick={handleClick}
            className={`${getBaseClasses()} nav-button`}
            style={style}
            disabled={state.action.type === 'none'}
            aria-label={state.content.label}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {state.content.icon && (
              <motion.div layout='position'>
                <Icon type={state.content.icon} />
              </motion.div>
            )}
            {showText && <motion.span layout='position'>{state.content.label}</motion.span>}
          </button>
        )}
      </motion.div>
    </div>
  )
}

// export the types for use in other components
export type { NavButtonProps }
