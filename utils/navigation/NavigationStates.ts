import type { NavButtonState } from '@molecules/NavButton.tsx'

/**
 * NavigationStates utility
 * Calculates button states and positions based on current route
 * Handles the logic for button morphing between homepage and subpage layouts
 */

/**
 * Calculate button positions and states based on current route
 * Pure function that transforms route state into button configurations
 */
export const getButtonStates = (currentPath: string): Record<string, NavButtonState> => {
  const isHomepage = currentPath === '/'
  const isShowsPage = currentPath === '/shows'
  const isContactPage = currentPath === '/contact'

  // layout constants
  const containerWidth = 280
  const padding = 0
  const buttonGap = 12
  const narrowWidth = 48

  if (isHomepage) {
    // homepage layout: [Shows] [Contact] [Menu]
    const availableWidth = containerWidth - narrowWidth - buttonGap
    const navButtonWidth = (availableWidth - buttonGap) / 2

    return {
      shows: {
        id: 'shows',
        key: 'shows',
        role: 'nav-item',
        position: 'left',
        content: { label: 'Shows' },
        action: { type: 'navigate', href: '/shows' },
        isActive: false,
      },
      contact: {
        id: 'contact',
        key: 'contact',
        role: 'nav-item',
        position: 'center',
        content: { label: 'Contact' },
        action: { type: 'navigate', href: '/contact' },
        isActive: false,
      },
      menu: {
        id: 'menu',
        key: 'menu',
        role: 'action-button',
        position: 'right',
        content: { label: 'Menu', icon: 'menu' },
        action: { type: 'menu' },
        isActive: false,
      },
    }
  } else {
    // subpage layout: [Back] [Page Title] [Menu]
    const titleWidth = containerWidth - (2 * narrowWidth) - (2 * buttonGap)

    return {
      shows: {
        id: 'shows',
        key: 'shows',
        role: 'back-button',
        position: 'left',
        content: { label: 'Back', icon: 'back' },
        action: { type: 'back' },
        isActive: false,
      },
      contact: {
        id: 'contact',
        key: 'contact',
        role: 'page-title',
        position: 'center',
        content: { label: isContactPage ? 'Contact' : isShowsPage ? 'Shows' : 'Page' },
        action: { type: 'none' },
        isActive: true,
      },
      menu: {
        id: 'menu',
        key: 'menu',
        role: 'action-button',
        position: 'right',
        content: { label: 'Menu', icon: 'menu' },
        action: { type: 'menu' },
        isActive: false,
      },
    }
  }
}
