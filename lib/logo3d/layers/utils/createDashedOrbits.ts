import * as THREE from 'three'
import { GeometricOptions } from '../GeometricLayer.ts'

/**
 * Creates dashed orbit lines with varying patterns
 */
export const createDashedOrbits = (
  THREE: any,
  options: GeometricOptions = {},
) => {
  const {
    radius = 1,
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.7,
    variationFactor = 1, // Controls how much random variation to apply (0-1)
    linewidth = 1, // Default line width
  } = options

  const orbitGroup = new THREE.Group()
  const orbitCount = 4

  for (let i = 0; i < orbitCount; i++) {
    const orbitRadius = radius * (0.85 + i * 0.12)

    // Create a custom dashed line using curve and points
    const curve = new THREE.EllipseCurve(
      0,
      0, // center
      orbitRadius,
      orbitRadius, // x/y radius
      0,
      Math.PI * 2, // start/end angle
      false, // clockwise
      0, // rotation
    )

    const points = curve.getPoints(128)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // Setup material for dashed look
    const dashSize = 0.1 + i * 0.05
    const gapSize = 0.1 + (i % 2) * 0.15

    const material = new THREE.LineDashedMaterial({
      color: i % 2 === 0 ? color : secondaryColor,
      linewidth, // Use the passed in linewidth
      scale: 1,
      dashSize,
      gapSize,
      transparent: true,
      opacity: opacity - i * 0.1,
    })

    const line = new THREE.Line(geometry, material)
    line.computeLineDistances() // Required for dashed lines

    // FIXED ROTATION: Don't use Math.PI/2 which makes it edge-on to camera
    // Base rotation is now 0 so orbits are flat and visible to the camera
    line.rotation.x = 0 + rotationAngle

    // Apply additional rotation based on variationFactor
    line.rotation.y = Math.PI * 0.1 * i * variationFactor

    // Apply z-position variation based on variationFactor
    const zPosition = (i - orbitCount / 2) * height * 0.05 * variationFactor
    line.position.z = zPosition

    orbitGroup.add(line)
  }

  return orbitGroup
}
