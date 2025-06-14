import { animationStyleFunctions, easeInEasing } from '@lib/utils/actionZoneAnimationStyles.ts'
import type { NavButtonState } from './types.ts'

/** Defines the state of a button within the action zone for a specific animation variant. */
export type ActionZoneAnimationButton = NavButtonState

/** Defines the dynamic layout properties for the action zone container. */
export type ActionZoneAnimationLayoutStyles = {
  // A function returning the height of the container.
  height: () => number | string
  // A function returning the border radius of the container.
  borderRadius: () => number | string
}

/** Animation config for a single action zone state (e.g., collapsed, expanded). */
export type ActionZoneAnimationLayout = {
  // An array of button configurations to be rendered in this animation state.
  buttons?: ActionZoneAnimationButton[]
  // Framer Motion animation properties (type, duration, easing).
  animation?: {
    type: 'spring' | 'tween'
    duration: number
    easing: string | number[] | ((t: number) => number)
  }
  // Layout properties for the action zone container in this state.
  layout?: ActionZoneAnimationLayoutStyles
}

/** Configuration object that defines all possible animation states for the Action Zone. */
export type ActionZoneAnimationConfig = {
  // Animation variants for the "collapsed" state, used for default navigation.
  collapsedDefault: Record<string, ActionZoneAnimationLayout>
  // Animation variants for the "collapsed" state when a back button is present.
  collapsedBack: Record<string, ActionZoneAnimationLayout>
  // Animation variants for the "expanded" menu state.
  expandedMenu: Record<string, ActionZoneAnimationLayout>
}

const actionZoneAnimationConfig: ActionZoneAnimationConfig = {
  collapsedDefault: {
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
    '/shows': {
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
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
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
    default: {
      animation: { type: 'tween', duration: 0.5, easing: 'easeInOut' },
      layout: {
        height: animationStyleFunctions.getExpandedHeight,
        borderRadius: animationStyleFunctions.getExpandedBorderRadius,
      },
    },
  },
}

export default actionZoneAnimationConfig
