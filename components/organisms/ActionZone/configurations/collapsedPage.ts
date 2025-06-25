import type { ActionZoneConfigRoot } from './types.ts'

/**
 * CollapsedPage layout config for ActionZone (back button + title + menu button)
 * Fully recursive: animation, style, layout, and children (same structure at every level).
 *
 * @example
 * import { collapsedPage } from './ActionZone/collapsedPage'
 */
export const collapsedPage: ActionZoneConfigRoot = {
  '/*': {
    type: 'container',
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
          layoutId: 'menu-button', // Enables morphing across layouts
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      },
    },
  },
  '/shows': {
    type: 'container',
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
          content: { label: 'Shows' },
          position: 'center',
          action: { type: 'none' },
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
  '/contact': {
    type: 'container',
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
          content: { label: 'Contact' },
          position: 'center',
          action: { type: 'none' },
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
  '/bio': {
    type: 'container',
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
          content: { label: 'Bio' },
          position: 'center',
          action: { type: 'none' },
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
