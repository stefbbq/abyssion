import { animationStyleFunctions, easeInEasing } from '@lib/utils/actionZoneAnimationStyles.ts'
import type { NavButtonState } from './types.ts'

/**
 * Defines the state of a button within the action zone for a specific animation variant.
 */
export type ActionZoneAnimationButton = NavButtonState

/**
 * Defines the dynamic layout properties for the action zone container.
 */
export type ActionZoneAnimationLayoutStyles = {
  // A function returning the height of the container.
  height: () => number | string
  // A function returning the border radius of the container.
  borderRadius: () => number | string
}

/**
 * Animation config for the main ActionZone container/layout (Framer Motion props)
 */
export type ActionZoneContainerAnimationConfig = {
  type: 'spring' | 'tween'
  duration: number
  easing: string | number[] | ((t: number) => number)
}

/**
 * Animation config for a single action zone state (e.g., collapsed, expanded).
 */
export type ActionZoneAnimationLayout = {
  // An array of button configurations to be rendered in this animation state.
  buttons?: AnimatedNavButtonState[]
  // Framer Motion animation properties (type, duration, easing).
  animation?: ActionZoneContainerAnimationConfig
  // Layout properties for the action zone container in this state.
  layout?: ActionZoneAnimationLayoutStyles
}

/**
 * Configuration object that defines all possible animation states for the Action Zone.
 */
export type ActionZoneAnimationConfig = {
  // Animation variants for the "collapsed" state, used for default navigation.
  collapsedDefault: Record<string, ActionZoneAnimationLayout>
  // Animation variants for the "collapsed" state when a back button is present.
  collapsedBack: Record<string, ActionZoneAnimationLayout>
  // Animation variants for the "expanded" menu state.
  expandedMenu: Record<string, ActionZoneAnimationLayout>
  // Animation variants for ActionZoneButton (button fade in/out, etc)
  buttonVariants: ActionZoneAnimationVariant
  // Animation variants for ActionZoneMenuButton (expanded menu item fade in/out)
  menuButtonVariants: ActionZoneAnimationVariant
  // Animation variants for ActionZoneExpandedMenu container and children
  expandedMenuVariants: ActionZoneExpandedMenuVariants
}

/**
 * Animation variant for a single element (button, social link, etc)
 */
export type ActionZoneAnimationVariant = {
  // Framer Motion animation for initial state (type, duration, easing).
  initial: object
  // Framer Motion animation for animate state (type, duration, easing).
  animate: object
  // Framer Motion animation for exit state (type, duration, easing).
  exit?: object
  // Framer Motion animation on exit (type, duration, easing).
  transition?: object
}

/**
 * Animation variant for elements with visible/hidden states (e.g. container, button in expanded menu)
 */
export type ActionZoneMotionVisibilityVariant = {
  // Framer Motion animation for visible state (type, duration, easing).
  visible: object
  // Framer Motion animation for hidden state (type, duration, easing).
  hidden: object
}

/**
 * Animation variant for expanded menu container and children
 */
export type ActionZoneExpandedMenuVariants = {
  container: ActionZoneMotionVisibilityVariant
  button: ActionZoneMotionVisibilityVariant
  socialLinks: ActionZoneAnimationVariant
  parentContainer: ActionZoneAnimationVariant
}

/**
 * Extends NavButtonState to allow an optional animation property for per-button animation
 * and an optional buttonClassNames property for per-button Tailwind class overrides
 */
export type AnimatedNavButtonState = NavButtonState & {
  animation?: ActionZoneAnimationVariant
  /**
   * Optional: custom Tailwind class string for this button (overrides default)
   */
  buttonClassNames?: string
}

const actionZoneAnimationConfig: ActionZoneAnimationConfig = {
  collapsedDefault: {
    // default variant for the collapsed state
    default: {
      buttons: [
        {
          id: 'shows',
          key: 'shows',
          role: 'nav-item',
          content: { label: 'Shows' },
          position: 'left',
          action: { type: 'navigate', href: '/shows' },
        },
        {
          id: 'contact',
          key: 'contact',
          role: 'nav-item',
          content: { label: 'Contact' },
          position: 'center',
          action: { type: 'navigate', href: '/contact' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
    // route matched variant for the collapsed state
    '/shows': {
      buttons: [
        {
          id: 'back-button',
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
          animation: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0, duration: 0.1 },
          },
          buttonClassNames:
            'w-full h-full inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-md gap-2 nav-button transition focus:outline-none focus:ring-0 active:bg-transparent active:outline-none active:ring-0 hover:bg-transparent',
        },
        {
          id: 'shows',
          key: 'page-title',
          role: 'page-title',
          content: { label: 'Shows' },
          position: 'center',
          action: { type: 'none' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.2, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
    // route matched variant for the collapsed state
    '/contact': {
      buttons: [
        {
          id: 'back-button',
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
        },
        {
          id: 'contact',
          key: 'page-title',
          role: 'page-title',
          content: { label: 'Contact' },
          position: 'center',
          action: { type: 'none' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
  },
  collapsedBack: {
    // default variant for the collapsed state with a back button
    default: {
      buttons: [
        {
          id: 'back-button',
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
        },
        {
          id: 'page-title',
          key: 'page-title',
          role: 'page-title',
          content: { label: '' },
          position: 'center',
          action: { type: 'none' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
  },
  expandedMenu: {
    // default variant for the expanded menu state
    default: {
      animation: { type: 'tween', duration: .25, easing: 'easeInOut' },
      layout: {
        height: animationStyleFunctions.getExpandedHeight,
        borderRadius: animationStyleFunctions.getExpandedBorderRadius,
      },
    },
  },
  buttonVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: animationStyleFunctions.springEasing || [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: animationStyleFunctions.springEasing || [0.22, 1, 0.36, 1] } },
  },
  menuButtonVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: animationStyleFunctions.springEasing || [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: animationStyleFunctions.springEasing || [0.22, 1, 0.36, 1] } },
  },
  expandedMenuVariants: {
    container: {
      visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
      hidden: {},
    },
    button: {
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    },
    /**
     * Animation variants for social links in the expanded menu
     */
    socialLinks: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    /**
     * Animation for the parent container <div> of the expanded menu
     */
    parentContainer: {
      initial: {},
      animate: {},
      exit: {},
      transition: {},
    },
  },
}

export default actionZoneAnimationConfig
