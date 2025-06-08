import * as Three from 'three'
import { createCircleOutline } from './createCircleOutline.ts'

/**
 * Create a crosshair shape
 */
export const createCrosshair = (
  THREE: typeof Three,
  radius = 0.5,
  thickness = 0.02,
  centerRadius = 0.05,
): Three.Group => {
  const group = new THREE.Group()

  const centerCircle = new THREE.Mesh(
    createCircleOutline(THREE, centerRadius, 32, thickness),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  )
  group.add(centerCircle)

  // Create four lines extending from center
  const directions = [
    { x: 1, y: 0 }, // right
    { x: -1, y: 0 }, // left
    { x: 0, y: 1 }, // up
    { x: 0, y: -1 }, // down
  ]

  directions.forEach((dir) => {
    // Inner and outer points
    const innerX = dir.x * (centerRadius + thickness)
    const innerY = dir.y * (centerRadius + thickness)
    const outerX = dir.x * radius
    const outerY = dir.y * radius

    // Create line geometry
    const lineGeo = new THREE.BufferGeometry()
    const positions = [innerX, innerY, 0, outerX, outerY, 0]
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    // Create line
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: thickness * 100 }))
    group.add(line)
  })

  return group
}
