import type { ActionZoneLayout } from '../types.ts'
import { createNavButton } from '../utils/createNavButton.ts'
import { createActionButton } from '../utils/createActionButton.ts'
import { createCollapsedLayout } from '../utils/createLayoutConfig.ts'
import navData from '@data/nav.json' with { type: 'json' }

/**
 * Creates the collapsed action zone configuration
 * Shows main navigation sections (excluding home) plus menu button
 * Used for single page scrolling navigation
 */
export const createCollapsedConfig = (): ActionZoneLayout => {
  // Filter out home since that's the current page context
  const navItems = navData.mainNav.filter((item) => item.key !== 'home')

  // Manually assign the 3 nav buttons to the 3 available slots
  const navButtons = []

  // bio goes in left slot
  const bioItem = navItems.find((item) => item.key === 'bio')
  if (bioItem) {
    navButtons.push(createNavButton({
      id: 'nav-bio',
      key: 'bio',
      label: bioItem.label,
      href: bioItem.path,
      position: 'left',
      flex: '1',
    }))
  }

  // shows goes in center slot
  const showsItem = navItems.find((item) => item.key === 'shows')
  if (showsItem) {
    navButtons.push(createNavButton({
      id: 'nav-shows',
      key: 'shows',
      label: showsItem.label,
      href: showsItem.path,
      position: 'center',
      flex: '1',
    }))
  }

  // contact button
  const contactItem = navItems.find((item) => item.key === 'contact')
  if (contactItem) {
    navButtons.push(createNavButton({
      id: 'nav-contact',
      key: 'contact',
      label: contactItem.label,
      href: contactItem.path,
      position: 'center',
      flex: '1',
    }))
  }

  return {
    buttons: [
      ...navButtons,
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
  }
}
