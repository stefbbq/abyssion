import * as Three from 'three'

import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'
import { GeometricOptions } from '@libgl/layers/GeometricLayer.ts'
import { getDashedOrbitsConfig } from '@libgl/layers/config.ts'
import { lc, log } from '@lib/logger/index.ts'
import { createThickDashedLine } from '@libgl/geometry/createThickDashedLine.ts'
import { interpolateColors } from '@lib/theme/colorUtils/interpolateColors.ts'

/**
 * Creates dashed orbit lines with varying patterns
 */
export const createDashedOrbits = (
  THREE: typeof Three,
  options: GeometricOptions = getDashedOrbitsConfig(),
) => {
  const {
    minRadius = 0.5,
    maxRadius = 1.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    minOpacity = 0.1,
    maxOpacity = 1,
    variationFactor = 1,
    linewidth = 1,
    zBase = 0,
    zSpread = 0,
    thickness = 0.01, // Base thickness
    minThicknessMultiplier = 0.4,
    maxThicknessMultiplier = 2.2,
  } = options

  const isMobile = isMobileDevice()

  const thicknessMultiplier = isMobile ? thickness * 2 : thickness
  const minThickness = minThicknessMultiplier * thicknessMultiplier
  const maxThickness = maxThicknessMultiplier * thicknessMultiplier

  const orbitGroup = new THREE.Group()
  const orbitCount = typeof options.count === 'number' ? options.count : 4

  // Helper lerp
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  for (let i = 0; i < orbitCount; i++) {
    const t = orbitCount === 1 ? 0.5 : i / (orbitCount - 1)

    // Randomness helpers
    const rand = () => (Math.random() - 0.5) * 2
    const radiusJitterAmount = 0.15 * (maxRadius - minRadius) // tune as needed

    const opacityJitterAmount = 0.15 * Math.abs(maxOpacity - minOpacity) // tune as needed

    // Evenly space orbits, add randomness based on variationFactor
    const baseRadius = lerp(minRadius, maxRadius, t)
    const orbitRadius = baseRadius + rand() * variationFactor * radiusJitterAmount
    const baseOpacity = lerp(maxOpacity, minOpacity, t) * (isMobile ? 2 : 1) // Opacity: most opaque in the center, least on the outside, add randomness

    // calculate radius-based fading
    const radiusRatio = orbitRadius / maxRadius
    let radiusFade = 1.0
    if (radiusRatio > 0.5) {
      // fade from 1.0 at 50% radius to 0.2 at 100% radius
      radiusFade = lerp(1.0, 0.2, (radiusRatio - 0.5) / 0.5)
    }

    const orbitOpacity = Math.max(0, Math.min(1, (baseOpacity + rand() * variationFactor * opacityJitterAmount) * radiusFade))
    const curve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0)

    const dashSize = 0.2 + i * 0.1
    const gapSize = dashSize * 0.3 // gaps are 30% of dash size

    // randomly blend between the two colors
    const colorBlend = Math.random() // 0 = fully color, 1 = fully secondaryColor
    const numericColor = interpolateColors(color, secondaryColor, colorBlend)

    // calculate varied thickness for this orbit
    const orbitThickness = lerp(minThickness, maxThickness, Math.random()) * linewidth

    // create thick dashed line using mesh geometry
    const thickLine = createThickDashedLine(THREE, curve, {
      color: numericColor,
      opacity: orbitOpacity,
      thickness: orbitThickness,
      dashSize: dashSize,
      gapSize: gapSize,
    })

    thickLine.rotation.x = 0 + rotationAngle

    // randomize z-position around zBase
    const zJitter = (Math.random() - 0.5) * 2 * zSpread
    const zPosition = zBase + zJitter
    thickLine.position.z = zPosition

    // Create a holder group for x/y jitter
    const orbitHolder = new THREE.Group()
    orbitHolder.add(thickLine)

    // Make x/y jitter very subtle, but random, for organic look
    const maxXYJitter = 0.01 // Try 0.01 for a pixel or two
    orbitHolder.position.x += rand() * maxXYJitter * variationFactor
    orbitHolder.position.y += rand() * maxXYJitter * variationFactor + 0.1

    // Add rotation properties for slow random rotation around z-axis only (facing camera)
    const rotationSpeed = (Math.random() * 0.002 + 0.0005) * (Math.random() < 0.5 ? 1 : -1) // Random slow speed and direction

    // Store rotation properties in userData for animation system
    orbitHolder.userData = {
      rotationSpeed,
      rotationAxis: 'z', // Only rotate around z-axis to keep orbits facing camera
      originalPosition: orbitHolder.position.clone(),
    }

    orbitGroup.add(orbitHolder)

    // log orbit creation details
    log(lc.GL_GEOMETRY, `Created dashed orbit`, {
      index: i,
      orbitRadius,
      orbitOpacity,
      radiusRatio,
      radiusFade,
      dashSize,
      linewidth,
      gapSize,
      color: numericColor,
      zPosition,
      xJitter: orbitHolder.position.x,
      yJitter: orbitHolder.position.y,
      baseThickness: thickness,
      actualThickness: orbitThickness,
      thicknessMultiplier: orbitThickness / thickness,
      rotationSpeed: orbitHolder.userData.rotationSpeed,
      rotationAxis: orbitHolder.userData.rotationAxis,
    })
  }

  log(lc.GL_GEOMETRY, `Total dashed orbits created:`, orbitCount)

  if (typeof options.zPosition === 'number') orbitGroup.position.z += options.zPosition

  return orbitGroup
}
