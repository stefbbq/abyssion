/**
 * @module UILayer
 *
 * Manages the 3D shape layer around the logo
 */

import { createCircleOutline, createGrid, createHexagonOutline, createTriangleIndicator } from '../geometry/index.ts'
import { createShapeLayer } from './utils/createShapeLayer.ts'
import { SHAPE_LAYER_CONFIG } from './config.ts'
import { createRandomTechShape } from './utils/createTechShapes.ts'

/**
 * Creates a 3D shape layer that surrounds the logo
 */
export const createUILayer = (
  THREE: any,
  width: number,
  height: number,
) => {
  // Create a new scene for the UI overlay
  const overlayScene = new THREE.Scene()

  // Create an orthographic camera for 2D overlay
  const aspect = width / height
  const overlayCamera = new THREE.OrthographicCamera(
    -aspect,
    aspect,
    1,
    -1,
    0.1,
    10,
  )
  overlayCamera.position.z = 2

  // Create a group to hold all the shapes
  const shapeGroup = new THREE.Group()

  // First create the base shape layer using the existing function
  const baseLayer = createShapeLayer(THREE, { radius: SHAPE_LAYER_CONFIG.RADIUS, variationFactor: 1.0 })
  shapeGroup.add(baseLayer)

  // Add additional tech shapes around the logo
  for (let i = 0; i < SHAPE_LAYER_CONFIG.TECH_SHAPES_COUNT; i++) {
    const angle = (i / SHAPE_LAYER_CONFIG.TECH_SHAPES_COUNT) * Math.PI * 2
    const distance = SHAPE_LAYER_CONFIG.MIN_DISTANCE +
      Math.random() * (SHAPE_LAYER_CONFIG.MAX_DISTANCE - SHAPE_LAYER_CONFIG.MIN_DISTANCE)

    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const z = (Math.random() - 0.5) * SHAPE_LAYER_CONFIG.HEIGHT

    // Create a random tech shape
    const shape = createRandomTechShape(THREE)

    // Position and scale the shape
    shape.position.set(x, y, z)

    // Random rotation
    shape.rotation.x = Math.random() * Math.PI * 2
    shape.rotation.y = Math.random() * Math.PI * 2
    shape.rotation.z = Math.random() * Math.PI * 2

    // Add rotation animation
    const rotSpeed = (Math.random() - 0.5) * SHAPE_LAYER_CONFIG.ROTATION_SPEED
    shape.userData = { rotSpeed }

    // Add to the group
    shapeGroup.add(shape)
  }

  overlayScene.add(shapeGroup)

  // Add a resize method
  function resize(newWidth: number, newHeight: number) {
    const newAspect = newWidth / newHeight
    overlayCamera.left = -newAspect
    overlayCamera.right = newAspect
    overlayCamera.updateProjectionMatrix()
  }

  return {
    scene: overlayScene,
    camera: overlayCamera,
    resize,
  }
}
