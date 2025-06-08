import * as Three from 'three'
import { createCircleOutline, createGrid, createHexagonOutline, createTriangleIndicator } from '@libgl/geometry/index.ts'

/**
 * available shape types for tech shape generation
 */
export type TechShapeType = 'hexagon' | 'circle' | 'triangle' | 'grid'

/**
 * creates a random technical-looking shape with randomized properties
 * @param THREE threejs instance
 * @returns random technical shape mesh
 */
export const createRandomTechShape = (THREE: typeof Three) => {
  // choose a random shape type from the available shapes
  const shapeTypes: TechShapeType[] = [
    'hexagon',
    'circle',
    'triangle',
    'grid',
  ]

  const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
  let shape

  // create shape based on chosen type
  const size = 0.1 + Math.random() * 0.2

  switch (randomType) {
    case 'hexagon':
      shape = new THREE.Mesh(
        createHexagonOutline(THREE, size, size * 0.1),
        new THREE.MeshBasicMaterial(),
      )
      break
    case 'circle':
      shape = new THREE.Mesh(
        createCircleOutline(THREE, size, 32, size * 0.1),
        new THREE.MeshBasicMaterial(),
      )
      break
    case 'triangle':
      shape = new THREE.Mesh(
        createTriangleIndicator(THREE, size, size * 0.1),
        new THREE.MeshBasicMaterial(),
      )
      break
    case 'grid':
      shape = new THREE.Mesh(
        createGrid(THREE, size * 2, size * 2, 5, 5, size * 0.05),
        new THREE.MeshBasicMaterial(),
      )
      break
  }

  // randomize material properties
  const isWireframe = Math.random() < 0.5
  const PRIMARY_COLOR = 0x00ffff
  const SECONDARY_COLOR = 0xff00ff
  const OPACITY = 0.7
  const color = Math.random() < 0.5 ? PRIMARY_COLOR : SECONDARY_COLOR

  // apply material to the shape
  if (shape) {
    shape.material = new THREE.MeshBasicMaterial({
      color,
      wireframe: isWireframe,
      transparent: true,
      opacity: OPACITY,
    })
  }

  return shape
}

/**
 * creates a technical shape with specific parameters
 * @param THREE threejs instance
 * @param type specific shape type to create
 * @param size base size of the shape
 * @param color color of the shape
 * @param isWireframe whether to render as wireframe
 * @param opacity transparency level
 * @returns configured technical shape mesh
 */
export const createTechShape = (
  THREE: typeof Three,
  type: TechShapeType,
  size: number,
  color: number | string,
  isWireframe = false,
  opacity = 0.7,
) => {
  let shape

  switch (type) {
    case 'hexagon':
      shape = new THREE.Mesh(
        createHexagonOutline(THREE, size, size * 0.1),
        new THREE.MeshBasicMaterial(),
      )
      break
    case 'circle':
      shape = new THREE.Mesh(
        createCircleOutline(THREE, size, 32, size * 0.1),
        new THREE.MeshBasicMaterial(),
      )
      break
    case 'triangle':
      shape = new THREE.Mesh(
        createTriangleIndicator(THREE, size, size * 0.1),
        new THREE.MeshBasicMaterial(),
      )
      break
    case 'grid':
      shape = new THREE.Mesh(
        createGrid(THREE, size * 2, size * 2, 5, 5, size * 0.05),
        new THREE.MeshBasicMaterial(),
      )
      break
  }

  if (shape) {
    shape.material = new THREE.MeshBasicMaterial({
      color,
      wireframe: isWireframe,
      transparent: true,
      opacity,
    })
  }

  return shape
}
