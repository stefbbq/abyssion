import { createOrbitControls } from './core/createOrbitControls.ts'
import { createMouseTracking } from './core/createMouseTracking.ts'
import { createKeyboardControls } from './core/createKeyboardControls.ts'
import { defaultOrbitControlsConfig } from './config/defaultOrbitControlsConfig.ts'
import type { KeyboardInputConfig, OrbitControlsConfig } from './types.ts'
import * as THREE from 'three'

/**
 * Controls system state
 */
type ControlsSystem = {
  readonly orbitControls: any // Three.js OrbitControls
  readonly mouseTracking: ReturnType<typeof createMouseTracking>
  readonly keyboardControls: ReturnType<typeof createKeyboardControls>
  readonly cleanup: () => void
}

/**
 * Create complete controls system
 * Main orchestrating function that composes all control subsystems
 */
export const createControlsSystem = async (
  camera: THREE.Camera,
  domElement: HTMLElement,
  options: {
    readonly orbitConfig?: Partial<OrbitControlsConfig>
    readonly keyboardConfig: KeyboardInputConfig
    readonly mouseCoefficient: number
    readonly onToggleRotation: () => void
    readonly onRegenerateLayers: () => void
  },
): Promise<ControlsSystem> => {
  // Merge configurations immutably
  const orbitConfig: OrbitControlsConfig = {
    ...defaultOrbitControlsConfig,
    ...options.orbitConfig,
  }

  // Create subsystems
  const orbitControls = await createOrbitControls(camera, domElement, orbitConfig)

  const mouseTracking = createMouseTracking(options.mouseCoefficient)

  const keyboardControls = createKeyboardControls(options.keyboardConfig, {
    onToggleRotation: () => {
      orbitControls.autoRotate = !orbitControls.autoRotate
      options.onToggleRotation()
    },
    onRegenerateLayers: options.onRegenerateLayers,
  })

  // Activate keyboard controls
  keyboardControls.activate()

  const cleanup = () => {
    mouseTracking.cleanup()
    keyboardControls.cleanup()
  }

  return {
    orbitControls,
    mouseTracking,
    keyboardControls,
    cleanup,
  }
}
