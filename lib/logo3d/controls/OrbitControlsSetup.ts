/**
 * OrbitControlsSetup.ts
 * 
 * Setup and configuration for camera orbit controls
 */

import { INPUT_KEYS } from './constants.ts'

/**
 * Create and configure orbit controls
 */
export const setupOrbitControls = async (THREE: any, camera: any, domElement: HTMLElement) => {
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  
  const controls = new OrbitControls(camera, domElement)
  
  // General control settings
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.rotateSpeed = 0.5
  
  // Zoom settings
  controls.enableZoom = true
  controls.zoomSpeed = 0.5
  controls.minDistance = 3 // Minimum zoom distance
  controls.maxDistance = 20 // Maximum zoom distance
  
  // Pan settings
  controls.enablePan = true
  controls.panSpeed = 0.5
  
  // Auto-rotation (disabled by default)
  controls.autoRotate = false
  controls.autoRotateSpeed = 1.0
  
  return controls
}

/**
 * Set up keyboard event handlers
 */
export const setupKeyboardControls = (
  controls: any, 
  onRegenerateRandomLayers: () => void
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Toggle auto-rotation on "R" key press
    if (INPUT_KEYS.TOGGLE_ROTATION.includes(event.key)) {
      controls.autoRotate = !controls.autoRotate
    }
    
    // Regenerate random layers on "G" key press
    if (INPUT_KEYS.REGENERATE_LAYERS.includes(event.key)) {
      onRegenerateRandomLayers()
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
} 