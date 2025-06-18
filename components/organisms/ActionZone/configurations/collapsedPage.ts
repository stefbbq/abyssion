import { animationStyleFunctions, easeInEasing } from '../utils/actionZoneAnimationStyles.ts'

/**
 * CollapsedPage layout config for ActionZone (back button + title + menu button)
 * Fully recursive: animation, style, layout, and children (same structure at every level).
 *
 * @example
 * import { collapsedPage } from './ActionZone/collapsedPage'
 */
export const collapsedPage = {
  '/*': {
    type: 'container',
    style: {
      height: animationStyleFunctions.getCollapsedHeight(),
      borderRadius: animationStyleFunctions.getCollapsedBorderRadius(),
    },
    layout: {
      grid: 'rows: 1; cols: 3',
      slots: ['back', 'page-title', 'menu'],
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '0.5rem',
    },
    children: {
      back: {
        type: 'button',
        props: {
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
        },
      },
      'page-title': {
        type: 'button',
        props: {
          key: 'page-title',
          role: 'page-title',
          content: { label: '' },
          position: 'center',
          action: { type: 'none' },
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
  },
  // Add route-specific, selector-specific, or child-specific overrides as needed
}
