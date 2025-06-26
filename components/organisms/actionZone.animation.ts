import type { NavButtonState } from '@data/types.ts'

// Prebaked style mixins/constants for each button type
export const navItemStyle = {
  height: '50px',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 500,
  flex: '1 1 0%',
  flexShrink: 1,
}

export const pageTitleStyle = {
  height: '50px',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  flex: '1 1 0%',
  flexShrink: 1,
}

export const actionButtonStyle = {
  height: '50px',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 500,
  width: '56px',
  flex: '0 0 56px',
  flexShrink: 0,
}

export const backButtonStyle = {
  height: '50px',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 500,
  width: '56px',
  flex: '0 0 56px',
  flexShrink: 0,
}

// Export the ActionZoneButton type for use in components
export type ActionZoneButton = NavButtonState & {
  flex?: string
  style?: Record<string, string | number>
}

/**
 * Defines the dynamic layout properties for the action zone container.
 */
export type ActionZoneLayoutStyles = {
  height: () => number | string
  borderRadius: () => number | string
}

/**
 * Layout config for a single action zone state (e.g., collapsed, expanded).
 */
export type ActionZoneLayout = {
  buttons?: ActionZoneButton[]
  layout?: ActionZoneLayoutStyles
}

// height and border radius functions
export const getCollapsedHeight = () => 80
export const getCollapsedBorderRadius = () => 40
export const getExpandedHeight = () => 'auto'
export const getExpandedBorderRadius = () => 24

/**
 * Configuration object that defines all possible static states for the Action Zone.
 */
export type ActionZoneConfig = {
  collapsed: { buttons: ActionZoneButton[]; layout: { height: () => number | string; borderRadius: () => number | string } }
  collapsedPage: { buttons: ActionZoneButton[]; layout: { height: () => number | string; borderRadius: () => number | string } }
  expandedMenu: { buttons: ActionZoneButton[]; layout: { height: () => number | string; borderRadius: () => number | string } }
}

const actionZoneConfig: ActionZoneConfig = {
  collapsed: {
    buttons: [
      {
        id: 'shows',
        key: 'shows',
        role: 'nav-item',
        content: { label: 'Shows' },
        position: 'left',
        action: { type: 'navigate', href: '/shows' },
        flex: '1 1 0%',
        style: navItemStyle,
      },
      {
        id: 'contact',
        key: 'contact',
        role: 'nav-item',
        content: { label: 'Contact' },
        position: 'center',
        action: { type: 'navigate', href: '/contact' },
        flex: '1 1 0%',
        style: navItemStyle,
      },
      {
        id: 'menu',
        key: 'menu',
        role: 'action-button',
        content: { label: 'Menu', icon: 'menu' },
        position: 'right',
        action: { type: 'menu' },
        flex: '0 0 56px',
        style: actionButtonStyle,
      },
    ],
    layout: {
      height: getCollapsedHeight(),
      borderRadius: getCollapsedBorderRadius(),
    },
  },
  collapsedPage: {
    buttons: [
      {
        id: 'back-button',
        key: 'back',
        role: 'back-button',
        content: { label: 'Back', icon: 'back' },
        position: 'left',
        action: { type: 'back' },
        flex: '0 0 56px',
        style: backButtonStyle,
      },
      {
        id: 'page-title',
        key: 'page-title',
        role: 'page-title',
        content: { label: '' },
        position: 'center',
        action: { type: 'none' },
        flex: '1 1 0%',
        style: pageTitleStyle,
      },
      {
        id: 'menu',
        key: 'menu',
        role: 'action-button',
        content: { label: 'Menu', icon: 'menu' },
        position: 'right',
        action: { type: 'menu' },
        flex: '0 0 56px',
        style: actionButtonStyle,
      },
    ],
    layout: {
      height: getCollapsedHeight(),
      borderRadius: getCollapsedBorderRadius(),
    },
  },

  expandedMenu: {
    buttons: [
      {
        id: 'home',
        key: 'home',
        role: 'nav-item',
        content: { label: 'Home' },
        position: 'left',
        action: { type: 'navigate', href: '/' },
        flex: '1 1 0%',
        style: navItemStyle,
      },
      {
        id: 'shows',
        key: 'shows',
        role: 'nav-item',
        content: { label: 'Shows' },
        position: 'center',
        action: { type: 'navigate', href: '/shows' },
        flex: '1 1 0%',
        style: navItemStyle,
      },
      {
        id: 'bio',
        key: 'bio',
        role: 'nav-item',
        content: { label: 'Bio' },
        position: 'center',
        action: { type: 'navigate', href: '/bio' },
        flex: '1 1 0%',
        style: navItemStyle,
      },
      {
        id: 'contact',
        key: 'contact',
        role: 'nav-item',
        content: { label: 'Contact' },
        position: 'right',
        action: { type: 'navigate', href: '/contact' },
        flex: '1 1 0%',
        style: navItemStyle,
      },
    ],
    layout: {
      height: getExpandedHeight(),
      borderRadius: getExpandedBorderRadius(),
    },
  },
}

export default actionZoneConfig
