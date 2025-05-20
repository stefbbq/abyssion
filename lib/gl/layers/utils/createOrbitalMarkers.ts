import { createCircleOutline, createHexagonOutline } from '../../geometry/index.ts'
import { GeometricOptions } from '../GeometricLayer.ts'
import { getOrbitalMarkersConfig } from '../config.ts'

/**
 * Creates markers and indicators along orbital paths
 */
export const createOrbitalMarkers = (
  THREE: any,
  options: GeometricOptions = getOrbitalMarkersConfig ? getOrbitalMarkersConfig() : {},
) => {
  const {
    radius = 1,
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.7,
    variationFactor = 1, // Controls how much random variation to apply (0-1)
  } = options

  const markerGroup = new THREE.Group()

  // FIXED ROTATION: Apply rotation to the entire group to make it flat toward the camera
  markerGroup.rotation.x = rotationAngle

  const markerLocations = [
    { radius: radius * 0.9, angle: Math.PI * 0.2, size: 0.06 },
    { radius: radius * 1.1, angle: Math.PI * 0.8, size: 0.08 },
    { radius: radius * 1.3, angle: Math.PI * 1.5, size: 0.05 },
    { radius: radius * 0.8, angle: Math.PI * 1.1, size: 0.04 },
  ]

  markerLocations.forEach((location, i) => {
    // Calculate position - keep in flat X,Y plane with minimal Z variation
    const x = Math.cos(location.angle) * location.radius
    const y = Math.sin(location.angle) * location.radius

    // Apply small z-variation scaled by variationFactor
    const z = (i % 2 === 0 ? 1 : -1) * height * 0.1 * variationFactor

    // Create marker based on index
    let marker

    if (i === 0) {
      // Circular marker with ring
      const markerSubGroup = new THREE.Group()

      // Inner circle
      const innerCircle = new THREE.Mesh(
        new THREE.CircleGeometry(location.size * 0.4, 16),
        new THREE.MeshBasicMaterial({
          color: secondaryColor,
          transparent: true,
          opacity: opacity + 0.1,
        }),
      )

      // Outer ring
      const outerRing = new THREE.Mesh(
        new THREE.RingGeometry(location.size * 0.6, location.size, 16),
        new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity - 0.1,
          side: THREE.DoubleSide,
        }),
      )

      markerSubGroup.add(innerCircle)
      markerSubGroup.add(outerRing)
      marker = markerSubGroup
    } else if (i === 1) {
      // Hexagonal marker
      marker = new THREE.Mesh(
        createHexagonOutline(THREE, location.size, location.size * 0.1),
        new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity,
          wireframe: true,
        }),
      )
    } else {
      // Simple circular marker
      marker = new THREE.Mesh(
        createCircleOutline(THREE, location.size, 16, location.size * 0.05),
        new THREE.MeshBasicMaterial({
          color: i === 2 ? secondaryColor : color,
          transparent: true,
          opacity: opacity,
        }),
      )
    }

    // Position marker directly in X, Y plane with minimal Z variation
    marker.position.set(x, y, z)

    markerGroup.add(marker)
  })

  return markerGroup
}
