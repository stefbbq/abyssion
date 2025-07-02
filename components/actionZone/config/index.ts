import type { ActionZoneConfig } from '../types.ts'
import { createCollapsedConfig } from './collapsedConfig.ts'
import { createCollapsedPageConfig } from './collapsedPageConfig.ts'
import { createExpandedMenuConfig } from './expandedMenuConfig.ts'

/**
 * Creates the complete action zone configuration
 * Pure function that assembles all configuration states
 */
export const createActionZoneConfig = (): ActionZoneConfig => ({
  collapsed: createCollapsedConfig(),
  collapsedPage: createCollapsedPageConfig(),
  expandedMenu: createExpandedMenuConfig(),
})

// default export for backward compatibility
export default createActionZoneConfig()
