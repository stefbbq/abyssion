import type { OrbitControlsConfig } from '../types.ts'
import * as THREE from 'three'

/**
 * Create and configure orbit controls
 * Pure function that sets up Three.js OrbitControls with given configuration
 */
export const createOrbitControls = async (
  camera: THREE.Camera,
  domElement: HTMLElement,
  config: OrbitControlsConfig,
) => {
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

  const controls = new OrbitControls(camera, domElement)

  // Apply configuration immutably
  controls.enableDamping = config.enableDamping
  controls.dampingFactor = config.dampingFactor
  controls.rotateSpeed = config.rotateSpeed
  controls.enableZoom = config.enableZoom
  controls.zoomSpeed = config.zoomSpeed
  controls.minDistance = config.minDistance
  controls.maxDistance = config.maxDistance
  controls.enablePan = config.enablePan
  controls.panSpeed = config.panSpeed
  controls.autoRotate = config.autoRotate
  controls.autoRotateSpeed = config.autoRotateSpeed

  return controls
}
