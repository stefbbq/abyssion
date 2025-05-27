import { createCircleOutline } from './createCircleOutline.ts'

/**
 * Create a partial circle (arc) outline
 */
export const createArcOutline = (
  THREE: typeof import('three'),
  radius = 1,
  segments = 32,
  thickness = 0.02,
  thetaStart = 0,
  thetaLength = Math.PI / 2, // Default to quarter circle
): import('three').BufferGeometry => {
  return createCircleOutline(THREE, radius, segments, thickness, thetaStart, thetaLength)
}
