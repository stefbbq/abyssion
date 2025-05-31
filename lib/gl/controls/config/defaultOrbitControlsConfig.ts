import type { OrbitControlsConfig } from '../types.ts'

/**
 * Default orbit controls configuration
 * Immutable configuration object following functional principles
 */
export const defaultOrbitControlsConfig: OrbitControlsConfig = {
  enableDamping: true,
  dampingFactor: 0.05,
  rotateSpeed: 0.5,
  enableZoom: true,
  zoomSpeed: 0.5,
  minDistance: 3,
  maxDistance: 20,
  enablePan: true,
  panSpeed: 0.5,
  autoRotate: false,
  autoRotateSpeed: 1.0,
} as const
