import * as Three from 'three'

type CalculatePosition = (time: number, index: number, zPos: number, totalLayers: number) => { x: number; y: number }

/**
 * schedules a burst reset for a plane's position using a provided position calculator
 */
export const scheduleBurstReset = (
  plane: Three.Mesh,
  time: number,
  planeIndex: number,
  zPos: number,
  totalLayers: number,
  durationMs: number,
  calculatePosition: CalculatePosition,
) => {
  setTimeout(() => {
    if (!plane) return
    const resetPosition = calculatePosition(time, planeIndex, zPos, totalLayers)
    plane.position.x = resetPosition.x
    plane.position.y = resetPosition.y
  }, durationMs)
}
