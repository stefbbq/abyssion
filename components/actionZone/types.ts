import type { NavButtonState } from '@data/types.ts'

// action zone button with additional styling and layout properties
export type ActionZoneButton = NavButtonState & {
  // flex layout properties for the button
  flex?: string
  // inline style overrides
  style?: Record<string, string | number>
}

// layout configuration functions for dynamic sizing
export type ActionZoneLayoutStyles = {
  // function returning height value
  height: () => number | string
  // function returning border radius value
  borderRadius: () => number | string
}

// complete layout configuration for a single action zone state
export type ActionZoneLayout = {
  // array of buttons for this state
  buttons?: ActionZoneButton[]
  // layout styling functions
  layout?: ActionZoneLayoutStyles
}

// all possible action zone configurations
export type ActionZoneConfig = {
  // collapsed state (home page)
  collapsed: ActionZoneLayout
  // expanded menu state
  expandedMenu: ActionZoneLayout
}
