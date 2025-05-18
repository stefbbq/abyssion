import * as THREE from 'three'
import { GeometricOptions } from '../GeometricLayer.ts'

/**
 * Creates concentric rings with configurable properties
 */
export const createConcentricRings = (
  THREE: any,
  options: GeometricOptions = {},
) => {
  const {
    radius = 1,
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.4,
    segments = 128,
    variationFactor = 1, // Controls how much random variation to apply (0-1)
    thickness: customThickness,
  } = options

  const ringGroup = new THREE.Group()
  const ringCount = 6

  for (let i = 0; i < ringCount; i++) {
    const ringRadius = radius * (0.7 + i * 0.09)
    // Use customThickness if provided, otherwise use the default values
    const thickness = customThickness || (0.01 + (i % 3 === 0 ? 0.015 : 0.005))

    // Create ring geometry
    const ringGeometry = new THREE.TorusGeometry(ringRadius, thickness, 6, segments)

    // Create ring material with varying opacity
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: i % 3 === 1 ? secondaryColor : color,
      transparent: true,
      opacity: opacity - (i % 2 === 0 ? 0.1 : 0) + (i === 1 || i === 4 ? 0.3 : 0),
      side: THREE.DoubleSide,
    })

    const ring = new THREE.Mesh(ringGeometry, ringMaterial)

    // FIXED ROTATION: Don't use Math.PI/2 which makes it edge-on to camera
    // Base rotation is now 0 so rings are flat and visible to the camera
    ring.rotation.x = 0 + rotationAngle

    // Apply additional rotation scaled by variationFactor
    const individualVariation = variationFactor * (Math.PI * 0.08 * (i - ringCount / 2) * 0.5)
    ring.rotation.z = variationFactor * (Math.PI * 0.05 * i * 0.3)

    ringGroup.add(ring)
  }

  return ringGroup
}
