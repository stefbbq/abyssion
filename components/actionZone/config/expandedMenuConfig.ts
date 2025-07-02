import type { ActionZoneLayout } from '../types.ts'
import { createNavButton } from '../utils/createNavButton.ts'
import { createExpandedLayout } from '../utils/createLayoutConfig.ts'

/**
 * Creates the expanded menu action zone configuration
 * Shows all navigation options in expanded state
 */
export const createExpandedMenuConfig = (): ActionZoneLayout => ({
  buttons: [
    createNavButton({
      id: 'home',
      key: 'home',
      label: 'Home',
      href: '/',
      position: 'left',
    }),
    createNavButton({
      id: 'shows',
      key: 'shows',
      label: 'Shows',
      href: '/shows',
      position: 'center',
    }),
    createNavButton({
      id: 'bio',
      key: 'bio',
      label: 'Bio',
      href: '/bio',
      position: 'center',
    }),
    createNavButton({
      id: 'contact',
      key: 'contact',
      label: 'Contact',
      href: '/contact',
      position: 'right',
    }),
  ],
  layout: createExpandedLayout(),
})
