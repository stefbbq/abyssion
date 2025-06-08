import * as Three from 'three'

/**
 * Create a circle outline with optional segments and thickness
 */
export const createCircleOutline = (
  THREE: typeof Three,
  radius = 1,
  segments = 64,
  thickness = 0.02,
  thetaStart = 0,
  thetaLength = Math.PI * 2,
): Three.BufferGeometry => {
  // Create an empty geometry to hold our segments
  const geometry = new THREE.BufferGeometry()
  const positions = []

  // Calculate points for both inner and outer circles
  const innerRadius = radius - thickness / 2
  const outerRadius = radius + thickness / 2

  // Create vertices for the tube around the circle
  for (let i = 0; i <= segments; i++) {
    const theta = thetaStart + (i / segments) * thetaLength
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)

    // Inner circle vertex
    positions.push(
      innerRadius * cosTheta,
      innerRadius * sinTheta,
      0,
    )

    // Outer circle vertex
    positions.push(
      outerRadius * cosTheta,
      outerRadius * sinTheta,
      0,
    )
  }

  // Set up indices for triangles
  const indices = []
  for (let i = 0; i < segments; i++) {
    const idx1 = i * 2
    const idx2 = idx1 + 1
    const idx3 = idx1 + 2
    const idx4 = idx1 + 3

    // First triangle
    indices.push(idx1, idx2, idx3)
    // Second triangle
    indices.push(idx2, idx4, idx3)
  }

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}
