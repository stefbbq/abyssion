import * as THREE from 'three'
import { GeometricOptions } from '../GeometricLayer.ts'

/**
 * Creates particle distributions along orbital paths
 */
export const createOrbitalParticles = (
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
    variationFactor = 1, // Controls how much random variation to apply (0-1)
    scale = 1, // Scale factor for particle size
  } = options

  const particleGroup = new THREE.Group()
  const orbitCount = 5

  for (let i = 0; i < orbitCount; i++) {
    const orbitRadius = radius * (0.75 + i * 0.12)
    const particleCount = 80 + i * 20

    // Create a group for this orbital path
    const orbitParticleGroup = new THREE.Group()

    // Create particles with different densities along the orbit
    for (let j = 0; j < particleCount; j++) {
      // Distribute particles with deliberate clustering
      const segmentLength = Math.PI * 2 / 8
      const segmentOffset = Math.floor(j / (particleCount / 8)) * segmentLength

      // Add some variation within each segment
      const variation = (j % (particleCount / 8)) / (particleCount / 8) * segmentLength

      // Calculate variable density based on position
      const density = Math.sin(j * 0.5) * 0.5 + 0.5

      // Skip some particles based on density to create varying distribution
      if (Math.random() > density * 0.8 + 0.2) continue

      // Calculate position along orbit
      const angle = segmentOffset + variation
      const x = Math.cos(angle) * orbitRadius * (1 + (Math.random() - 0.5) * 0.05 * variationFactor)
      const y = Math.sin(angle) * orbitRadius * (1 + (Math.random() - 0.5) * 0.05 * variationFactor)

      // Apply height variation based on variationFactor
      const z = (Math.random() - 0.5) * height * 0.04 * variationFactor

      // Apply scale to particle size
      const particleSize = (0.008 + Math.random() * 0.012) * scale

      // Use simple spheres for most particles for performance
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(particleSize, 4, 4),
        new THREE.MeshBasicMaterial({
          color: j % 5 === 0 ? secondaryColor : color,
          transparent: true,
          opacity: opacity + Math.random() * 0.4,
        }),
      )

      particle.position.set(x, y, z)
      orbitParticleGroup.add(particle)
    }

    // FIXED ROTATION: Don't use Math.PI/2 which makes it edge-on to camera
    // Base rotation is now 0 so particles are flat and visible to the camera
    orbitParticleGroup.rotation.x = 0 + rotationAngle

    // Apply additional rotation based on variationFactor
    const individualVariation = variationFactor * (Math.PI * 0.1 * (i - orbitCount / 2) * 0.3)
    orbitParticleGroup.rotation.z = Math.PI * 0.05 * i * variationFactor

    // Add to parent
    particleGroup.add(orbitParticleGroup)
  }

  return particleGroup
}
