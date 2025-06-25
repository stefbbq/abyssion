import { easeInOutEasing, socialLinksAnimation, staggeredContainerVariants, staggeredMenuAnimation } from '../constants.ts'
import { collapsedBorderRadius, collapsedHeight, expandedBorderRadius, expandedHeight } from '../constants.ts'
import type { ActionZoneConfigRoot } from './types.ts'

/**
 * Expanded layout config for ActionZone
 * Features staggered animations for menu items and improved timing
 *
 * @example
 * import { expanded } from './ActionZone/expanded'
 */
export const expanded: ActionZoneConfigRoot = {
  '/*': {
    type: 'container',
    animation: staggeredContainerVariants,
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
        animation: socialLinksAnimation,
      },
      shows: {
        type: 'menuButton',
        props: { id: 'shows', label: 'Shows', isActive: false },
        animation: staggeredMenuAnimation,
      },
      contact: {
        type: 'menuButton',
        props: { id: 'contact', label: 'Contact', isActive: false },
        animation: staggeredMenuAnimation,
      },
      about: {
        type: 'menuButton',
        props: { id: 'about', label: 'About', isActive: false },
        animation: staggeredMenuAnimation,
      },
    },
  },
}
