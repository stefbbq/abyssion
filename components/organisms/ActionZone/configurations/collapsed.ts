import { animationStyleFunctions, easeInEasing } from '../utils/actionZoneAnimationStyles.ts'
import type { ActionZoneConfigRoot } from './types.ts'

/**
 * Collapsed layout config for ActionZone (two nav buttons + menu button)
 * Fully recursive: animation, style, layout, and children (same structure at every level).
 *
 * @example
 * import { collapsed } from './ActionZone/collapsed'
 */
export const collapsed: ActionZoneConfigRoot = {
  '/*': {
    type: 'container',
    style: {
      height: animationStyleFunctions.getCollapsedHeight(),
      borderRadius: animationStyleFunctions.getCollapsedBorderRadius(),
    },
    layout: {
      grid: 'rows: 1; cols: 3',
      slots: ['shows', 'contact', 'menu'],
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '0.5rem',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    children: {
      shows: {
        type: 'button',
        props: {
          key: 'shows',
          role: 'nav-item',
          content: { label: 'Shows' },
          position: 'left',
          action: { type: 'navigate', href: '/shows' },
        },
      },
      contact: {
        type: 'button',
        props: {
          key: 'contact',
          role: 'nav-item',
          content: { label: 'Contact' },
          position: 'center',
          action: { type: 'navigate', href: '/contact' },
        },
      },
      menu: {
        type: 'button',
        props: {
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      },
    },
    animation: {
      initial: {
        height: animationStyleFunctions.getExpandedHeight(),
        borderRadius: animationStyleFunctions.getExpandedBorderRadius(),
      },
      animate: {
        height: animationStyleFunctions.getCollapsedHeight(),
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius(),
      },
      exit: {
        height: animationStyleFunctions.getExpandedHeight(),
        borderRadius: animationStyleFunctions.getExpandedBorderRadius(),
      },
      transition: {
        duration: 0.3,
        ease: easeInEasing,
      },
    },
  },
  // Add route-specific, selector-specific, or child-specific overrides as needed
}
