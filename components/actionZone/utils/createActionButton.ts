import type { ActionZoneButton } from '../types.ts'

// action button configuration parameters
type ActionButtonConfig = {
  // unique identifier
  id: string
  // routing key
  key: string
  // display label
  label: string
  // icon name
  icon?: 'back' | 'menu'
  // action type
  actionType: 'back' | 'menu' | 'none'
  // button position in layout
  position: 'left' | 'center' | 'right'
  // role type
  role?: 'action-button' | 'back-button' | 'page-title'
}

/**
 * Creates an action button configuration
 * Pure function for non-navigation buttons (back, menu, page titles)
 */
export const createActionButton = (config: ActionButtonConfig): ActionZoneButton => ({
  id: config.id,
  key: config.key,
  role: config.role || 'action-button',
  content: {
    label: config.label,
    ...(config.icon && { icon: config.icon }),
  },
  position: config.position,
  action: { type: config.actionType },
  flex: config.role === 'page-title' ? '1 1 0%' : '0 0 56px',
})
