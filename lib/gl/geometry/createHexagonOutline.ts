import * as Three from 'three'

/**
 * Create a hexagon outline
 */
export const createHexagonOutline = (
  THREE: typeof Three,
  radius = 1,
  thickness = 0.02,
): Three.BufferGeometry => {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const numSides = 6
  const innerRadius = radius - thickness / 2
  const outerRadius = radius + thickness / 2

  // Create vertices for the hexagon tube
  for (let i = 0; i <= numSides; i++) {
    const theta = (i / numSides) * Math.PI * 2
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)

    // Inner hexagon vertex
    positions.push(
      innerRadius * cosTheta,
      innerRadius * sinTheta,
      0,
    )

    // Outer hexagon vertex
    positions.push(
      outerRadius * cosTheta,
      outerRadius * sinTheta,
      0,
    )
  }

  // Set up indices for triangles
  const indices = []
  for (let i = 0; i < numSides; i++) {
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
