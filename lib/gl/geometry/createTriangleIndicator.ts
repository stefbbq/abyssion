/**
 * Create a triangular target indicator
 */
export const createTriangleIndicator = (
  THREE: typeof import('three'),
  size = 0.3,
  thickness = 0.02,
): import('three').BufferGeometry => {
  const geometry = new THREE.BufferGeometry()
  const points = [
    { x: 0, y: size }, // top
    { x: -size * 0.866, y: -size * 0.5 }, // bottom left
    { x: size * 0.866, y: -size * 0.5 }, // bottom right
  ]

  // Create outset points to give thickness
  const positions = []
  const indices = []

  // For each edge of the triangle
  for (let i = 0; i < 3; i++) {
    const start = points[i]
    const end = points[(i + 1) % 3]

    // Direction vector of the edge
    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)

    // Normalized perpendicular vector
    const perpX = -dy / length * thickness
    const perpY = dx / length * thickness

    // Four corners of this edge segment
    positions.push(
      start.x - perpX,
      start.y - perpY,
      0, // inner start
      start.x + perpX,
      start.y + perpY,
      0, // outer start
      end.x + perpX,
      end.y + perpY,
      0, // outer end
      end.x - perpX,
      end.y - perpY,
      0, // inner end
    )

    // Two triangles for this edge segment
    const baseIndex = i * 4
    indices.push(
      baseIndex,
      baseIndex + 1,
      baseIndex + 2,
      baseIndex,
      baseIndex + 2,
      baseIndex + 3,
    )
  }

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}
