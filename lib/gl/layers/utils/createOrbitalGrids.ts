import * as THREE from 'three'
import { GeometricOptions } from '../GeometricLayer.ts'
import { getOrbitalGridsConfig } from '../config.ts'

/**
 * Creates grid patterns along orbital planes
 */
export const createOrbitalGrids = (
  THREE: any,
  options: GeometricOptions = getOrbitalGridsConfig(),
) => {
  const {
    radius = 1,
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.15,
    variationFactor = .01, // Controls how much random variation to apply (0-1)
  } = options

  const gridGroup = new THREE.Group()
  const gridCount = 2

  for (let i = 0; i < gridCount; i++) {
    const gridRadius = radius * (0.9 + i * 0.2)
    const divisions = 16 + i * 8
    const gridOpacity = opacity - i * 0.05

    const gridMaterial = new THREE.LineBasicMaterial({
      color: i === 0 ? color : secondaryColor,
      transparent: true,
      opacity: gridOpacity,
    })

    const gridSubGroup = new THREE.Group()

    // Create circular segments
    for (let j = 1; j <= 3 + i; j++) {
      const segmentRadius = gridRadius * (j / (3 + i))
      const curve = new THREE.EllipseCurve(
        0,
        0,
        segmentRadius,
        segmentRadius,
        0,
        Math.PI * 2,
        false,
        0,
      )

      const points = curve.getPoints(64)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const circle = new THREE.Line(geometry, gridMaterial)

      gridSubGroup.add(circle)
    }

    // Create radial segments
    const radialSegmentCount = 12 + i * 4
    for (let j = 0; j < radialSegmentCount; j++) {
      const angle = (j / radialSegmentCount) * Math.PI * 2
      const startX = 0
      const startY = 0
      const endX = Math.cos(angle) * gridRadius
      const endY = Math.sin(angle) * gridRadius

      const points = [
        new THREE.Vector3(startX, startY, 0),
        new THREE.Vector3(endX, endY, 0),
      ]

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, gridMaterial)

      gridSubGroup.add(line)
    }

    // FIXED ROTATION: Don't use Math.PI/2 which makes it edge-on to camera
    // Base rotation is now 0 so it's visible flat to the camera
    gridSubGroup.rotation.x = 0 + rotationAngle

    // Apply additional rotation from main plane - scaled by variationFactor
    gridSubGroup.rotation.y = Math.PI * 0.15 * (i + 1) * variationFactor

    // Apply z-position variation based on variationFactor
    const zPosition = (i - gridCount / 2) * height * 0.15 * variationFactor
    gridSubGroup.position.z = zPosition

    gridGroup.add(gridSubGroup)
  }

  return gridGroup
}
