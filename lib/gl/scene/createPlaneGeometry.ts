import { PLANE_WIDTH, PLANE_HEIGHT } from './config.ts';

/**
 * Create plane geometry for the logo
 */
export const createPlaneGeometry = (
  THREE: typeof import('three')
): import('three').PlaneGeometry => {
  return new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT);
};
