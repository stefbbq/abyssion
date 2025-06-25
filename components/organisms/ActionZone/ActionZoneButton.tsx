import type { NavButtonState } from '@data/types.ts'
import { BackIcon, MenuIcon } from '@atoms/icons/index.ts'
import { motion, MotionProps } from 'framer-motion'
import { CSSProperties } from 'preact/compat'

/**
 * ActionZoneButton supports animation prop for config-driven variants and layoutId for morphing.
 *
 * @example
 * <ActionZoneButton state={...} onAction={...} layoutId="menu-button" />
 */
type Props = {
  state: any // TODO: replace with correct type if available
  onAction: (action: NavButtonState['action']) => void
  style?: CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  flex?: string
  transformOrigin?: string
  variant?: 'outlined' | 'plain'
  animation?: MotionProps
  layoutId?: string // For Framer Motion morphing between layouts
}

/**
 * ActionZoneButton component
 * Handles smooth morphing between different navigation roles with layoutId support.
 * Used for nav buttons, back buttons, menu buttons, and page titles.
 */
export const ActionZoneButton = (
  {
    state,
    onAction,
    style = {},
    onMouseEnter,
    onMouseLeave,
    flex,
    transformOrigin,
    variant = 'outlined',
    animation,
    layoutId,
  }: Props,
) => {
  const isActive = state?.isActive || state?.role === 'page-title'
  const isNavItem = state?.role === 'nav-item'
  const showText = state?.role === 'nav-item' || state?.role === 'page-title'
  const isLink = state?.action?.type === 'navigate'
  const isButton = state?.action?.type !== 'navigate'

  const defaultStyle: CSSProperties = {
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
    cursor: state?.action?.type === 'none' ? 'default' : 'pointer',
  }

  // Merge style defaults with incoming style
  const mergedStyle = { ...defaultStyle, ...style }

  const onClick = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    console.log('[ActionZoneButton] Button clicked, prevented propagation:', state?.action)
    if (state?.action?.type !== 'none') onAction(state.action)
  }

  // Container motion props - add layoutId if provided
  const containerMotionProps = {
    ...animation,
    style: {
      flex: flex || '0 0 auto',
      width: '100%',
      height: '100%',
      transformOrigin: transformOrigin || 'center',
    },
  }

  // Add layout props if layoutId is provided
  if (layoutId) {
    containerMotionProps.layout = true
    containerMotionProps.layoutId = layoutId
  }

  return (
    <motion.div {...containerMotionProps}>
      {/* Navigate */}
      {isLink && (
        <a
          href={state.action.href}
          className='nav-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0'
          aria-label={state.content.label}
          style={mergedStyle}
          {...{ onMouseEnter, onMouseLeave, onClick }}
          f-client-nav
          f-partial={`/partials${state.action.href === '/' ? '/home' : state.action.href}`}
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

      {/* Button */}
      {isButton && (
        <button
          type='button'
          className='nav-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:outline-none active:ring-0'
          disabled={state.action.type === 'none'}
          aria-label={state.content.label}
          style={mergedStyle}
          {...{ onClick, onMouseEnter, onMouseLeave }}
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
  )
}
