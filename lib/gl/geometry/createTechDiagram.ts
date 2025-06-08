import * as Three from 'three'
import { createCircleOutline } from './createCircleOutline.ts'

/**
 * Create a technical diagram pattern with connections
 */
export const createTechDiagram = (
  THREE: typeof Three,
  width = 2,
  height = 1.5,
  nodeCount = 6,
  lineWidth = 0.01,
): Three.Group => {
  const group = new THREE.Group()
  const nodes = []

  for (let i = 0; i < nodeCount; i++) {
    // Calculate random positions with some margin from edges
    const margin = 0.2
    const x = Math.random() * (width - margin * 2) - (width / 2 - margin)
    const y = Math.random() * (height - margin * 2) - (height / 2 - margin)

    // Random radius between 0.02 and 0.06
    const radius = 0.02 + Math.random() * 0.04

    const circle = new THREE.Mesh(
      createCircleOutline(THREE, radius, 16, lineWidth),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    )
    circle.position.set(x, y, 0)

    group.add(circle)
    nodes.push({ x, y, radius })
  }

  // Connect nodes with lines (not all, just some connections)
  const maxConnections = Math.min(nodeCount * 2, nodeCount * (nodeCount - 1) / 2)
  const connections = Math.max(nodeCount, Math.floor(maxConnections * 0.7))

  for (let i = 0; i < connections; i++) {
    // Pick two random nodes to connect
    const nodeA = Math.floor(Math.random() * nodeCount)
    let nodeB = Math.floor(Math.random() * nodeCount)
    while (nodeB === nodeA) {
      nodeB = Math.floor(Math.random() * nodeCount)
    }

    // Create line geometry
    const lineGeo = new THREE.BufferGeometry()
    const a = nodes[nodeA]
    const b = nodes[nodeB]

    // Calculate direction vector
    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / distance
    const ny = dy / distance

    // Start and end points (adjusted by radius to connect at circle edge)
    const startX = a.x + nx * a.radius
    const startY = a.y + ny * a.radius
    const endX = b.x - nx * b.radius
    const endY = b.y - ny * b.radius

    const positions = [
      startX,
      startY,
      0,
      endX,
      endY,
      0,
    ]
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    // Create line
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: lineWidth * 100 }))
    group.add(line)
  }

  return group
}
