import type { ActionZoneButton } from '../types.ts'

// navigation button configuration parameters
type NavButtonConfig = {
  // unique identifier
  id: string
  // routing key
  key: string
  // display label
  label: string
  // navigation path
  href: string
  // button position in layout
  position: 'left' | 'center' | 'right'
  // flex properties
  flex?: string
}

/**
 * Creates a navigation button configuration
 * Pure function that transforms input parameters into ActionZoneButton
 */
export const createNavButton = (config: NavButtonConfig): ActionZoneButton => ({
  id: config.id,
  key: config.key,
  role: 'nav-item',
  content: { label: config.label },
  position: config.position,
  action: { type: 'navigate', href: config.href },
  flex: config.flex || '1 1 0%',
})
