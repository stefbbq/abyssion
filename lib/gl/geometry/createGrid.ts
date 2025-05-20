/**
 * Create a square grid pattern
 */
export const createGrid = (
  THREE: any,
  width = 2,
  height = 2,
  divisionsX = 10,
  divisionsY = 10,
  lineWidth = 0.01,
) => {
  // Create an empty geometry for the grid
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const indices = []

  const halfWidth = width / 2
  const halfHeight = height / 2
  const cellWidth = width / divisionsX
  const cellHeight = height / divisionsY
  const halfLineWidth = lineWidth / 2

  let vertexIndex = 0

  // Create horizontal lines
  for (let y = 0; y <= divisionsY; y++) {
    const posY = -halfHeight + y * cellHeight

    // Line vertices (rectangle for each line)
    positions.push(
      -halfWidth,
      posY - halfLineWidth,
      0, // bottom left
      halfWidth,
      posY - halfLineWidth,
      0, // bottom right
      halfWidth,
      posY + halfLineWidth,
      0, // top right
      -halfWidth,
      posY + halfLineWidth,
      0, // top left
    )

    // Line faces (two triangles)
    indices.push(
      vertexIndex,
      vertexIndex + 1,
      vertexIndex + 2,
      vertexIndex,
      vertexIndex + 2,
      vertexIndex + 3,
    )

    vertexIndex += 4
  }

  // Create vertical lines
  for (let x = 0; x <= divisionsX; x++) {
    const posX = -halfWidth + x * cellWidth

    // Line vertices
    positions.push(
      posX - halfLineWidth,
      -halfHeight,
      0, // bottom left
      posX + halfLineWidth,
      -halfHeight,
      0, // bottom right
      posX + halfLineWidth,
      halfHeight,
      0, // top right
      posX - halfLineWidth,
      halfHeight,
      0, // top left
    )

    // Line faces
    indices.push(
      vertexIndex,
      vertexIndex + 1,
      vertexIndex + 2,
      vertexIndex,
      vertexIndex + 2,
      vertexIndex + 3,
    )

    vertexIndex += 4
  }

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return geometry
}
