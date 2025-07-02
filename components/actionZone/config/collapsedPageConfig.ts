import type { ActionZoneLayout } from '../types.ts'
import { createActionButton } from '../utils/createActionButton.ts'
import { createCollapsedLayout } from '../utils/createLayoutConfig.ts'

/**
 * Creates the collapsed page action zone configuration
 * Used on sub-pages with back button, page title, and menu
 */
export const createCollapsedPageConfig = (): ActionZoneLayout => ({
  buttons: [
    createActionButton({
      id: 'back-button',
      key: 'back',
      label: 'Back',
      icon: 'back',
      actionType: 'back',
      position: 'left',
      role: 'back-button',
    }),
    createActionButton({
      id: 'page-title',
      key: 'page-title',
      label: '',
      actionType: 'none',
      position: 'center',
      role: 'page-title',
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
