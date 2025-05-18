import { createCircleOutline } from '../../geometry/index.ts'
import { GeometricOptions } from '../GeometricLayer.ts'

/**
 * Creates celestial bodies that orbit the logo
 */
export const createCelestialBodies = (
  THREE: any,
  options: GeometricOptions = {},
) => {
  const {
    radius = 1,
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.8,
    planarDistribution = false, // When true, bodies are distributed on a flat plane
    variationFactor = 1, // Controls how much random variation to apply (0-1)
    scale = 1, // Scale factor for celestial body sizes
  } = options

  const bodyGroup = new THREE.Group()
  const bodyCount = 3

  // Apply rotation to the entire group
  bodyGroup.rotation.x = rotationAngle

  for (let i = 0; i < bodyCount; i++) {
    // Position in a balanced way around the scene
    const angle = (i / bodyCount) * Math.PI * 2
    const distance = radius * (0.7 + Math.random() * 0.3 * variationFactor)

    // Calculate position - keep in flat X,Y plane with optional Z variation
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    // Z position is 0 for planar or scaled by variation factor
    const z = planarDistribution ? 0 : (i - 1) * height * 0.4 * variationFactor

    // Create the celestial body with scaled size
    const size = (0.2 + i * 0.15) * scale
    let body

    if (i === 0) {
      // Black hole style
      body = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: opacity + 0.1,
        }),
      )

      // Add event horizon halo
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(size, size * 2, 32),
        new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity - 0.2,
          side: THREE.DoubleSide,
        }),
      )

      body.add(halo)
    } else {
      // Planet style
      body = new THREE.Mesh(
        createCircleOutline(THREE, size, 32, size * 0.1),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? color : secondaryColor,
          transparent: true,
          opacity: opacity,
          wireframe: i === 2,
        }),
      )
    }

    // Position directly in X,Y plane with optional Z
    body.position.set(x, y, z)

    // Apply minimal rotation to add subtle variation but keep visible to camera
    if (!planarDistribution) {
      body.rotation.x = Math.PI * 0.1 * variationFactor // Subtle tilt
      body.rotation.y = Math.PI / 3 * i * variationFactor
    }

    // Slow rotation animation
    const rotSpeed = 0.3 * (i === 0 ? -1 : 1)
    body.userData = { rotSpeed }

    bodyGroup.add(body)
  }

  return bodyGroup
}
