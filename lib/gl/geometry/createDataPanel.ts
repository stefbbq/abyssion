/**
 * Create a rectangular data frame/panel
 */
export const createDataPanel = (
  THREE: typeof import('three'),
  width = 1,
  height = 0.6,
  borderThickness = 0.02,
  cornerRadius = 0.1,
  color = 0x00ffff,
  opacity = 0.3,
): import('three').Group => {
  const group = new THREE.Group()
  const borderPath = new THREE.Shape()

  // Start at top left corner
  borderPath.moveTo(-width / 2 + cornerRadius, height / 2)
  // Top edge
  borderPath.lineTo(width / 2 - cornerRadius, height / 2)
  // Top right corner
  borderPath.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - cornerRadius)
  // Right edge
  borderPath.lineTo(width / 2, -height / 2 + cornerRadius)
  // Bottom right corner
  borderPath.quadraticCurveTo(width / 2, -height / 2, width / 2 - cornerRadius, -height / 2)
  // Bottom edge
  borderPath.lineTo(-width / 2 + cornerRadius, -height / 2)
  // Bottom left corner
  borderPath.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + cornerRadius)
  // Left edge
  borderPath.lineTo(-width / 2, height / 2 - cornerRadius)
  // Top left corner
  borderPath.quadraticCurveTo(-width / 2, height / 2, -width / 2 + cornerRadius, height / 2)

  // Inner path for cutout
  const holePath = new THREE.Path()
  const insetWidth = width - borderThickness * 2
  const insetHeight = height - borderThickness * 2
  const innerCornerRadius = Math.max(0, cornerRadius - borderThickness)

  // Start at top left inner corner
  holePath.moveTo(-insetWidth / 2 + innerCornerRadius, insetHeight / 2)
  // Top inner edge
  holePath.lineTo(insetWidth / 2 - innerCornerRadius, insetHeight / 2)
  // Top right inner corner
  holePath.quadraticCurveTo(insetWidth / 2, insetHeight / 2, insetWidth / 2, insetHeight / 2 - innerCornerRadius)
  // Right inner edge
  holePath.lineTo(insetWidth / 2, -insetHeight / 2 + innerCornerRadius)
  // Bottom right inner corner
  holePath.quadraticCurveTo(insetWidth / 2, -insetHeight / 2, insetWidth / 2 - innerCornerRadius, -insetHeight / 2)
  // Bottom inner edge
  holePath.lineTo(-insetWidth / 2 + innerCornerRadius, -insetHeight / 2)
  // Bottom left inner corner
  holePath.quadraticCurveTo(-insetWidth / 2, -insetHeight / 2, -insetWidth / 2, -insetHeight / 2 + innerCornerRadius)
  // Left inner edge
  holePath.lineTo(-insetWidth / 2, insetHeight / 2 - innerCornerRadius)
  // Top left inner corner
  holePath.quadraticCurveTo(-insetWidth / 2, insetHeight / 2, -insetWidth / 2 + innerCornerRadius, insetHeight / 2)

  // Add hole to main path
  borderPath.holes.push(holePath)

  // Create shape from path
  const borderGeometry = new THREE.ShapeGeometry(borderPath)

  // Create material for the panel
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  })

  // Create mesh and add to group
  const panelMesh = new THREE.Mesh(borderGeometry, material)
  group.add(panelMesh)

  return group
}
