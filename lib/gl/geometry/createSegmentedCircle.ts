import { createCircleOutline } from './createCircleOutline.ts'

/**
 * Create a circular segmented progress indicator
 */
export const createSegmentedCircle = (
  THREE: typeof import('three'),
  radius = 0.5,
  segments = 12,
  gapSize = 0.1,
  thickness = 0.03,
): import('three').Group => {
  const group = new THREE.Group()
  const segmentAngle = (Math.PI * 2 - (gapSize * segments)) / segments

  // Create each segment
  for (let i = 0; i < segments; i++) {
    const startAngle = i * (segmentAngle + gapSize)

    const segment = new THREE.Mesh(
      createCircleOutline(THREE, radius, 16, thickness, startAngle, segmentAngle),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    )

    group.add(segment)
  }

  return group
}
