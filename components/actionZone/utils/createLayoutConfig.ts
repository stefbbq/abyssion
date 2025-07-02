import type { ActionZoneLayoutStyles } from '../types.ts'

// layout size constants
const COLLAPSED_HEIGHT = 64
const COLLAPSED_BORDER_RADIUS = 32
const EXPANDED_BORDER_RADIUS = 20

/**
 * Creates collapsed layout configuration
 * Pure function returning layout styling functions
 */
export const createCollapsedLayout = (): ActionZoneLayoutStyles => ({
  height: () => COLLAPSED_HEIGHT,
  borderRadius: () => COLLAPSED_BORDER_RADIUS,
})

/**
 * Creates expanded layout configuration
 * Pure function for expanded menu layout
 */
export const createExpandedLayout = (): ActionZoneLayoutStyles => ({
  height: () => 'auto',
  borderRadius: () => EXPANDED_BORDER_RADIUS,
})
