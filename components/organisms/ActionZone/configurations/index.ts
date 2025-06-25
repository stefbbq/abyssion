import { collapsed } from './collapsed.ts'
import { collapsedPage } from './collapsedPage.ts'
import { expanded } from './expanded.ts'
import { layoutTransitions } from './layoutTransitions.ts'

export { collapsed } from './collapsed.ts'
export { collapsedPage } from './collapsedPage.ts'
export { expanded } from './expanded.ts'
export { layoutTransitions } from './layoutTransitions.ts'
export * from './types.ts'

export const actionZoneAnimationConfig = {
  collapsed,
  collapsedPage,
  expanded,
}

// Export layout transitions separately for easy access
export { layoutTransitions as actionZoneLayoutTransitions }
