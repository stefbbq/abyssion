import * as THREE from 'three'
import { createArcOutline, createCircleOutline, createHexagonOutline } from '../../geometry/index.ts'
import { GeometricOptions } from '../GeometricLayer.ts'

/**
 * Creates 3D geometric shapes for the UI elements in the 3D scene
 * These are shapes that exist within the 3D world (not on top as overlay)
 */
export const createShapeLayer = (
  THREE: typeof import('three'),
  options: GeometricOptions = {},
) => {
  const {
    radius = 2.5, // Base radius around the logo
    color = 0x88ccff,
    secondaryColor = 0xff4466,
    opacity = 0.5,
    rotationAngle = 0,
    variationFactor = 1, // Controls how much random variation to apply (0-1)
  } = options

  // Derive density from variationFactor for compatibility
  const density = variationFactor

  // Create a group to hold all shape elements
  const shapeGroup = new THREE.Group()

  // Apply rotation to the entire group
  shapeGroup.rotation.x = rotationAngle

  // Add a main circle outline surrounding everything
  const mainCircle = new THREE.Mesh(
    createCircleOutline(THREE, radius, 128, 0.01),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
    }),
  )
  shapeGroup.add(mainCircle)

  // Add hexagons around the circle
  const hexCount = 3 + Math.floor(density * 4)
  for (let i = 0; i < hexCount; i++) {
    // Random angle around the circle
    const angle = Math.random() * Math.PI * 2
    // Random radius
    const r = radius * (0.5 + Math.random() * 0.4)

    // Position
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    const z = (Math.random() - 0.5) * 0.1 * variationFactor

    // Create hexagon
    const hexagon = new THREE.Mesh(
      createHexagonOutline(
        THREE,
        0.1 + Math.random() * 0.15,
        0.005,
      ),
      new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? secondaryColor : i % 3 === 1 ? color : 0xffffff,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3,
      }),
    )

    hexagon.position.set(x, y, z)
    shapeGroup.add(hexagon)
  }

  // Add some arc elements
  const arcCount = 4 + Math.floor(density * 6)
  for (let i = 0; i < arcCount; i++) {
    // Random angle around the circle
    const angle = Math.random() * Math.PI * 2
    // Random radius
    const r = radius * (0.7 + Math.random() * 0.25)
    // Position
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    const z = (Math.random() - 0.5) * 0.1 * variationFactor

    // Create arc - random length
    const arcLength = Math.PI / 4 + Math.random() * (Math.PI / 2)
    const arcStart = Math.random() * Math.PI * 2
    const arc = new THREE.Mesh(
      createArcOutline(
        THREE,
        0.15 + Math.random() * 0.25,
        32,
        0.005 + Math.random() * 0.01,
        arcStart,
        arcLength,
      ),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? secondaryColor : color,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.3,
      }),
    )

    arc.position.set(x, y, z)
    // Random rotation
    arc.rotation.z = Math.random() * Math.PI * 2
    shapeGroup.add(arc)
  }

  return shapeGroup
}
