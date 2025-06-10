/**
 * @module UILayer
 *
 * Creates a responsive 3D shape layer that surrounds the logo
 */

import * as Three from 'three'
import { createShapeLayer } from './utils/createShapeLayer.ts'
import { getShapeLayerConfig } from './config.ts'
import { createRandomTechShape } from './utils/createTechShapes.ts'
import { getBaselineDimensions } from '@lib/gl/scene/utils/getBaselineDimensions.ts'
import { isMobileDevice } from '@lib/gl/scene/utils/isMobileDevice.ts'

/**
 * Creates a responsive 3D shape layer that surrounds the logo
 */
export const createUILayer = (
  THREE: typeof Three,
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

  // get responsive dimensions and mobile state
  const { scale } = getBaselineDimensions()
  const isMobile = isMobileDevice()
  const shapeConfig = getShapeLayerConfig()

  // adjust shape layer configuration for mobile
  const responsiveConfig = {
    radius: shapeConfig.radius * scale,
    techShapesCount: isMobile ? Math.floor(shapeConfig.techShapesCount * 0.8) : shapeConfig.techShapesCount,
    minDistance: shapeConfig.minDistance * scale,
    maxDistance: shapeConfig.maxDistance * scale,
    height: shapeConfig.height * scale,
    rotationSpeed: isMobile ? shapeConfig.rotationSpeed * 0.8 : shapeConfig.rotationSpeed,
  }

  // First create the base shape layer using the existing function
  const baseLayer = createShapeLayer(THREE, { radius: responsiveConfig.radius, variationFactor: 1.0 })
  shapeGroup.add(baseLayer)

  // Add additional tech shapes around the logo
  for (let i = 0; i < responsiveConfig.techShapesCount; i++) {
    const angle = (i / responsiveConfig.techShapesCount) * Math.PI * 2
    const distance = responsiveConfig.minDistance +
      Math.random() * (responsiveConfig.maxDistance - responsiveConfig.minDistance)

    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const z = (Math.random() - 0.5) * responsiveConfig.height

    // Create a random tech shape
    const shape = createRandomTechShape(THREE)

    // Position and scale the shape
    shape.position.set(x, y, z)

    // Keep shapes visible on mobile
    if (isMobile) {
      shape.scale.multiplyScalar(0.9)
    }

    // Random rotation
    shape.rotation.x = Math.random() * Math.PI * 2
    shape.rotation.y = Math.random() * Math.PI * 2
    shape.rotation.z = Math.random() * Math.PI * 2

    // Add rotation animation
    const rotSpeed = (Math.random() - 0.5) * responsiveConfig.rotationSpeed
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

    // Update shape scaling on resize
    const newResponsiveDimensions = getBaselineDimensions()
    const newScale = newResponsiveDimensions.scale

    // Update base layer scale
    baseLayer.scale.setScalar(newScale)

    // Update tech shapes
    shapeGroup.children.forEach((child: any, index: number) => {
      if (index === 0) return // Skip base layer

      const shape = child as any
      const baseScale = isMobileDevice() ? 0.8 : 1.0
      shape.scale.setScalar(baseScale * newScale)
    })
  }

  return {
    scene: overlayScene,
    camera: overlayCamera,
    resize,
  }
}
