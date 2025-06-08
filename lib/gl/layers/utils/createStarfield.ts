import * as Three from 'three'
import { GeometricOptions } from '../GeometricLayer.ts'

/**
 * Creates a detailed starfield of small particles
 */
export const createStarfield = (
  THREE: typeof Three,
  options: GeometricOptions = {},
) => {
  const {
    radius = 1,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.5,
    planarDistribution = false, // When true, stars are distributed on a flat plane
    scale = 1, // Scale factor for star sizes
  } = options

  const particleCount = 250
  const particles = new THREE.Group()

  // FIXED ROTATION: Apply rotation to the entire group
  particles.rotation.x = rotationAngle

  for (let i = 0; i < particleCount; i++) {
    // Use golden ratio distribution for more natural looking star pattern
    const phi = planarDistribution
      ? Math.PI / 2 // All particles on the XY plane when planarDistribution is true
      : Math.acos(1 - 2 * (i + 0.5) / particleCount) // Spherical distribution
    const theta = Math.PI * 2 * i * (1 / 1.618033988749895)

    // Distribute at varying distances from center
    const dist = radius * (0.8 + Math.random() * 0.4)

    // Calculate position based on distribution type
    let x, y, z

    if (planarDistribution) {
      // When planar, distribute in a circle on the XY plane
      x = Math.cos(theta) * dist
      y = Math.sin(theta) * dist
      z = 0 // Zero Z for perfect planar distribution
    } else {
      // Modified spherical distribution that's still visible to camera
      x = dist * Math.sin(phi) * Math.cos(theta)
      y = dist * Math.sin(phi) * Math.sin(theta)
      z = dist * Math.cos(phi) * 0.3
    }

    // Small dot with varying size, adjusted by scale parameter
    const size = (0.005 + Math.random() * (i % 20 === 0 ? 0.03 : 0.01)) * scale
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(size, 6, 6),
      new THREE.MeshBasicMaterial({
        color: i % 15 === 0 ? secondaryColor : color,
        transparent: true,
        opacity: opacity - 0.2 + Math.random() * 0.6,
      }),
    )

    // Position directly without additional rotation manipulation
    particle.position.set(x, y, z)
    particles.add(particle)
  }

  return particles
}
