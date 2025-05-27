import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'

/**
 * Create plane geometry for logo layers with responsive dimensions
 */
export const createLogoPlaneGeometry = (THREE: typeof import('three')): import('three').PlaneGeometry => {
  const { planeWidth, planeHeight } = getBaselineDimensions()
  return new THREE.PlaneGeometry(planeWidth, planeHeight)
}
