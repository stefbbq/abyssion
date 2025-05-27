import { getResponsiveDimensions } from './utils/getResponsiveDimensions.ts'

/**
 * Create plane geometry for logo layers with responsive dimensions
 */
export const createLogoPlaneGeometry = (THREE: typeof import('three')): import('three').PlaneGeometry => {
  const { planeWidth, planeHeight } = getResponsiveDimensions()
  return new THREE.PlaneGeometry(planeWidth, planeHeight)
}
