/**
 * Controls module
 * Provides camera orbit controls, mouse tracking, and keyboard shortcuts
 *
 * Follows functional programming principles:
 * - Pure functions for calculations
 * - Immutable state management
 * - Composable architecture
 * - Clean separation of concerns
 */

// Main orchestrator
export { createControlsSystem } from './createControlsSystem.ts'

// Core systems (for advanced usage)
export { createOrbitControls } from './core/createOrbitControls.ts'
export { createMouseTracking } from './core/createMouseTracking.ts'
export { createKeyboardControls } from './core/createKeyboardControls.ts'

// Pure calculation functions
export { calculateMousePosition } from './calculations/calculateMousePosition.ts'
export { calculateMouseRotationTarget } from './calculations/calculateMouseRotationTarget.ts'

// Configuration
export { defaultOrbitControlsConfig } from './config/defaultOrbitControlsConfig.ts'

// Types
export type {
  ControlsDependencies,
  KeyboardInputConfig,
  MousePosition,
  MouseRotationTarget,
  MouseTrackingState,
  OrbitControlsConfig,
} from './types.ts'
