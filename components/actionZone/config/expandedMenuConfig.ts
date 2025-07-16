import type { ActionZoneLayout } from '../types.ts'
import { createNavButton } from '../utils/createNavButton.ts'
import { createExpandedLayout } from '../utils/createLayoutConfig.ts'
import navData from '@data/nav.json' with { type: 'json' }

/**
 * Creates the expanded menu action zone configuration
 * Shows all navigation options including home (excluded from header)
 * Used for single page scrolling navigation
 */
export const createExpandedMenuConfig = (): ActionZoneLayout => {
  const navButtons = navData.mainNav.map((item, index) => {
    const positions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'center', 'right'] // home=left, bio=center, shows=center, contact=right
    return createNavButton({
      id: `nav-${item.key}`,
      key: item.key,
      label: item.label,
      href: item.path,
      position: positions[index] || 'center',
    })
  })

  return {
    buttons: navButtons,
    layout: createExpandedLayout(),
  }
}
