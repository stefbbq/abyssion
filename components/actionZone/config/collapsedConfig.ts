import type { ActionZoneLayout } from '../types.ts'
import { createNavButton } from '../utils/createNavButton.ts'
import { createActionButton } from '../utils/createActionButton.ts'
import { createCollapsedLayout } from '../utils/createLayoutConfig.ts'

/**
 * Creates the collapsed action zone configuration
 * Used on the home page with shows, bio, contact, and menu
 */
export const createCollapsedConfig = (): ActionZoneLayout => ({
  buttons: [
    createNavButton({
      id: 'shows',
      key: 'shows',
      label: 'Shows',
      href: '/shows',
      position: 'left',
      flex: '1',
    }),
    createNavButton({
      id: 'bio',
      key: 'bio',
      label: 'Bio',
      href: '/bio',
      position: 'center',
      flex: '1',
    }),
    createNavButton({
      id: 'contact',
      key: 'contact',
      label: 'Contact',
      href: '/contact',
      position: 'center',
      flex: '1',
    }),
    createActionButton({
      id: 'menu',
      key: 'menu',
      label: 'Menu',
      icon: 'menu',
      actionType: 'menu',
      position: 'right',
    }),
  ],
  layout: createCollapsedLayout(),
})
