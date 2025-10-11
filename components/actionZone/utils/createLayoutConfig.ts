import uiConfig from '@data/ui-config.json' with { type: 'json' }
import type { ActionZoneLayoutStyles } from '../types.ts'

/**
 * creates collapsed layout configuration
 */
export const createCollapsedLayout = (): ActionZoneLayoutStyles => ({
  height: () => uiConfig.actionZone.collapsedHeightPx,
  borderRadius: () => uiConfig.actionZone.collapsedBorderRadiusPx,
})

/**
 * creates expanded layout configuration
 */
export const createExpandedLayout = (): ActionZoneLayoutStyles => ({
  height: () => 'auto',
  borderRadius: () => uiConfig.actionZone.expandedBorderRadiusPx,
})
