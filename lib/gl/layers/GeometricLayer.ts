/**
 * @module GeometricLayer
 */

import { createShapeLayer } from './utils/createShapeLayer.ts'
import { SHAPE_LAYER_CONFIG } from './config.ts'
import {
  createCelestialBodies,
  createConcentricRings,
  createDashedOrbits,
  createOrbitalGrids,
  createOrbitalMarkers,
  createOrbitalParticles,
  createStarfield,
} from './utils/index.ts'

/**
 * Creates a cosmic-themed 3D layer that surrounds the logo with orbital rings and celestial elements
 */
export const createGeometricLayer = (
  THREE: typeof import('three'),
  radius = SHAPE_LAYER_CONFIG.RADIUS,
  height = SHAPE_LAYER_CONFIG.HEIGHT,
  rotationAngle = 0, // Angle from the main plane in radians
  planarConstraint = true, // When true, forces all elements to stay on the same plane
) => {
  // Create a group to hold all the shapes
  const shapeGroup = new THREE.Group()

  // First create the base shape layer using the existing function
  // const baseLayer = createShapeLayer(THREE, {
  //   radius,
  //   variationFactor: 1.0,
  // })
  // shapeGroup.add(baseLayer)

  // Create the geometric layer components directly
  const geometricRadius = radius * 1
  const color = SHAPE_LAYER_CONFIG.PRIMARY_COLOR
  const secondaryColor = SHAPE_LAYER_CONFIG.SECONDARY_COLOR

  // Global opacity modifier to make everything more faded
  const opacityModifier = 0.7

  // Chromatic aberration settings
  const chromaticOffset = 0.01 // Offset distance for chromatic aberration
  const useChromaticAberration = true

  // When using planar constraint, we ensure variationFactor is 0 for complete flatness
  const effectiveVariationFactor = planarConstraint ? 0 : 1

  // Add all geometric components - now properly oriented to be visible to the camera
  // shapeGroup.add(createConcentricRings(THREE, {
  //   radius: geometricRadius,
  //   height: planarConstraint ? 0 : height,
  //   color,
  //   secondaryColor,
  //   rotationAngle,
  //   variationFactor: effectiveVariationFactor,
  //   opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier,
  //   thickness: 0.005, // Thinner lines
  // }))

  // // Add chromatic aberration effect using slight offsets
  // if (useChromaticAberration) {
  //   // Red offset version
  //   const redRings = createConcentricRings(THREE, {
  //     radius: geometricRadius,
  //     height: planarConstraint ? 0 : height,
  //     color: 0xff8080, // Red tint
  //     secondaryColor: 0xff8080, // Red tint
  //     rotationAngle,
  //     variationFactor: effectiveVariationFactor,
  //     opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier * 0.4,
  //     thickness: 0.004, // Even thinner for aberration ghost
  //   })
  //   redRings.position.x += chromaticOffset
  //   shapeGroup.add(redRings)

  //   // Blue offset version
  //   const blueRings = createConcentricRings(THREE, {
  //     radius: geometricRadius,
  //     height: planarConstraint ? 0 : height,
  //     color: 0x8080ff, // Blue tint
  //     secondaryColor: 0x8080ff, // Blue tint
  //     rotationAngle,
  //     variationFactor: effectiveVariationFactor,
  //     opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier * 0.4,
  //     thickness: 0.004, // Even thinner for aberration ghost
  //   })
  //   blueRings.position.x -= chromaticOffset
  //   shapeGroup.add(blueRings)
  // }

  shapeGroup.add(createDashedOrbits(THREE))

  // shapeGroup.add(createOrbitalGrids(THREE, {
  //   radius: geometricRadius * 1.2,
  //   height: planarConstraint ? 0 : height,
  //   color,
  //   secondaryColor,
  //   rotationAngle,
  //   variationFactor: effectiveVariationFactor,
  //   opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier,
  //   thickness: 0.005, // Thinner lines
  // }))

  // shapeGroup.add(createOrbitalParticles(THREE, {
  //   radius: geometricRadius * 1.3,
  //   height: planarConstraint ? 0 : height,
  //   color,
  //   secondaryColor,
  //   rotationAngle,
  //   variationFactor: effectiveVariationFactor,
  //   opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier,
  //   scale: 0.7, // Smaller particles
  // }))

  // shapeGroup.add(createOrbitalMarkers(THREE, {
  //   radius: geometricRadius * 1.15,
  //   height: planarConstraint ? 0 : height,
  //   color,
  //   secondaryColor,
  //   rotationAngle,
  //   variationFactor: effectiveVariationFactor,
  //   opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier,
  //   thickness: 0.005, // Thinner lines
  // }))

  // shapeGroup.add(createStarfield(THREE, {
  //   radius: geometricRadius * 2.5,
  //   color,
  //   secondaryColor,
  //   rotationAngle,
  //   planarDistribution: planarConstraint,
  //   opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier,
  //   scale: 0.7, // Smaller stars
  // }))

  // shapeGroup.add(createCelestialBodies(THREE, {
  //   radius: geometricRadius * 1.8,
  //   height: planarConstraint ? 0 : height * 0.6,
  //   color,
  //   secondaryColor,
  //   rotationAngle,
  //   planarDistribution: planarConstraint,
  //   variationFactor: effectiveVariationFactor,
  //   opacity: SHAPE_LAYER_CONFIG.OPACITY * opacityModifier,
  //   scale: 0.8, // Slightly smaller celestial bodies
  // }))

  return shapeGroup
}

/**
 * common configuration options for geometric visual components
 * handles appearance, positioning and variation for 3D shapes
 */
export type GeometricOptions = {
  /** number of geometric shapes to create */
  count?: number

  /** depth offset of the geometric shape in world units */
  zPosition?: number

  /** base radius of the geometric shape in world units */
  radius?: number

  /** minimum radius for variation (used with variationFactor) */
  minRadius?: number

  /** maximum radius for variation (used with variationFactor) */
  maxRadius?: number

  /** vertical dimension of the shape in world units */
  height?: number

  /** primary color of the geometry as hex number (0xff0000) or string ('#ff0000') */
  color?: number | string

  /** secondary/accent color for multi-colored geometries */
  secondaryColor?: number | string

  /** rotation angle in radians from the main reference plane */
  rotationAngle?: number

  /** transparency level from 0 (fully transparent) to 1 (fully opaque) */
  opacity?: number

  /** minimum opacity for variation (used with variationFactor) */
  minOpacity?: number

  /** maximum opacity for variation (used with variationFactor) */
  maxOpacity?: number

  /** number of subdivisions for curved surfaces (higher = smoother) */
  segments?: number

  /** width/depth of the geometry from surface to surface */
  thickness?: number

  /** controls randomization intensity in position and rotation (0-1) */
  variationFactor?: number

  /** when true, elements are distributed along a flat plane rather than in 3D space */
  planarDistribution?: boolean

  /** width of lines for wireframe or line-based geometries */
  linewidth?: number

  /** uniform size multiplier for the entire component */
  scale?: number
}
