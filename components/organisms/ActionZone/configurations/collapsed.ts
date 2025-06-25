import { fadeInOutAnimation } from '../constants.ts'
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
        animation: fadeInOutAnimation,
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
        animation: fadeInOutAnimation,
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
          layoutId: 'menu-button', // Enables morphing across layouts
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      },
    },
  },
}
