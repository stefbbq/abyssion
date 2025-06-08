import * as Three from 'three'
import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'

/**
 * Creates standardized plane geometry for logo layer rendering with responsive dimensions.
 *
 * Generates a THREE.PlaneGeometry sized according to the baseline dimensions system,
 * which ensures consistent logo scaling across different screen sizes and aspect ratios.
 * This geometry serves as the foundation for all logo layer meshes in the 3D scene,
 * providing a uniform canvas for shader-based logo rendering effects.
 */
export const createLogoPlaneGeometry = (THREE: typeof Three): Three.PlaneGeometry => {
  const { planeWidth, planeHeight } = getBaselineDimensions()
  return new THREE.PlaneGeometry(planeWidth, planeHeight)
}
