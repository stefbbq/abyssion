/**
 * A single node in the ActionZone config tree. Recursive, supports arbitrary nesting.
 */
export type ActionZoneConfigNode = {
  // The type of UI element (e.g. 'container', 'button', etc)
  type: string
  // Optional style overrides for this node (CSS-in-JS style object)
  style?: Record<string, unknown>
  // Optional grid layout definition for containers
  layout?: ActionZoneGridLayout
  // Optional child nodes, keyed by slot or name
  children?: Record<string, ActionZoneConfigNode>
  // Optional props to pass to the rendered component
  props?: Record<string, unknown>
  // Optional Framer Motion animation variant for this node
  animation?: ActionZoneAnimationVariant
}

/**
 * The root of an ActionZone config tree. Maps route or selector keys to config nodes.
 */
export type ActionZoneConfigRoot = Record<string, ActionZoneConfigNode>

/**
 * Grid layout definition for a container node. Used for CSS grid properties.
 */
export type ActionZoneGridLayout = {
  // A string describing the grid (e.g. 'rows: 2; cols: 1')
  grid: string
  // The ordered slot keys for children
  slots: string[]
  // Optional CSS grid-template-rows value
  gridTemplateRows?: string
  // Optional CSS grid-template-columns value
  gridTemplateColumns?: string
  // Optional CSS gap value
  gap?: string
  // Optional CSS justify-content value for grid container
  justifyContent?: string
  // Optional CSS align-items value for grid container
  alignItems?: string
}

/**
 * Animation variant for Framer Motion. Used for initial, animate, exit, and transition states.
 */
export type ActionZoneAnimationVariant = {
  // Initial animation state
  initial: object
  // Animate-to state
  animate: object
  // Optional exit animation state
  exit?: object
  // Optional transition config
  transition?: object
}
