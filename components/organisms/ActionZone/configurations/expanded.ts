import { animationStyleFunctions, easeInEasing } from '../utils/actionZoneAnimationStyles.ts'
import type { ActionZoneConfigRoot } from './types.ts'

/**
 * Expanded layout config for ActionZone
 * Fully recursive: animation, style, layout, and children (same structure at every level).
 *
 * @example
 * import { expanded } from './ActionZone/expanded'
 */
export const expanded: ActionZoneConfigRoot = {
  '/*': {
    type: 'container',
    style: {
      height: animationStyleFunctions.getCollapsedHeight(),
      borderRadius: animationStyleFunctions.getExpandedBorderRadius(),
    },
    animation: {
      initial: {
        height: animationStyleFunctions.getCollapsedHeight(),
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius(),
      },
      animate: {
        height: animationStyleFunctions.getExpandedHeight(),
        borderRadius: animationStyleFunctions.getExpandedBorderRadius(),
      },
      exit: {
        height: animationStyleFunctions.getCollapsedHeight(),
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius(),
      },
      transition: {
        duration: 0.3,
        ease: easeInEasing,
      },
    },
    layout: {
      grid: 'rows: 2; cols: 1',
      slots: ['socialLinks', 'shows', 'contact', 'about'],
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    },
    children: {
      socialLinks: {
        type: 'socialLinks',
        props: {
          // socialLinks: to be injected at runtime or via context/props
        },
        animation: {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
      },
      shows: {
        type: 'menuButton',
        props: { id: 'shows', label: 'Shows', isActive: false },
        animation: {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
      },
      contact: {
        type: 'menuButton',
        props: { id: 'contact', label: 'Contact', isActive: false },
        animation: {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
      },
      about: {
        type: 'menuButton',
        props: { id: 'about', label: 'About', isActive: false },
        animation: {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        },
      },
    },
  },
  // Add route-specific, selector-specific, or child-specific overrides as needed
}
