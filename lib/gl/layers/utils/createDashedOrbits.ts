import * as Three from 'three'
import { GeometricOptions } from '@libgl/layers/GeometricLayer.ts'
import { getDashedOrbitsConfig } from '@libgl/layers/config.ts'

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
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    minOpacity = 0.1,
    maxOpacity = 1,
    variationFactor = 1,
    linewidth = 1,
  } = options

  const orbitGroup = new THREE.Group()
  const orbitCount = typeof options.count === 'number' ? options.count : 4

  // Helper lerp
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  for (let i = 0; i < orbitCount; i++) {
    const t = orbitCount === 1 ? 0.5 : i / (orbitCount - 1)
    // Randomness helpers
    const rand = () => (Math.random() - 0.5) * 2
    const radiusJitterAmount = 0.15 * (maxRadius - minRadius) // tune as needed
    const opacityJitterAmount = 0.15 * Math.abs(maxOpacity - minOpacity) // tune as needed

    // Evenly space orbits, add randomness based on variationFactor
    const baseRadius = lerp(minRadius, maxRadius, t)
    const orbitRadius = baseRadius + rand() * variationFactor * radiusJitterAmount
    // Opacity: most opaque in the center, least on the outside, add randomness
    const baseOpacity = lerp(maxOpacity, minOpacity, t)
    const orbitOpacity = Math.max(0, Math.min(1, baseOpacity + rand() * variationFactor * opacityJitterAmount))

    const curve = new THREE.EllipseCurve(
      0,
      0,
      orbitRadius,
      orbitRadius,
      0,
      Math.PI * 2,
      false,
      0,
    )
    const points = curve.getPoints(128)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const dashSize = 0.1 + i * 0.05
    const gapSize = 0.1 + (i % 2) * 0.15
    const material = new THREE.LineDashedMaterial({
      color: i % 2 === 0 ? color : secondaryColor,
      linewidth,
      scale: 1,
      dashSize,
      gapSize,
      transparent: true,
      opacity: orbitOpacity,
    })

    const line = new THREE.Line(geometry, material)
    line.computeLineDistances()
    line.rotation.x = 0 + rotationAngle
    const zPosition = (i - orbitCount / 2) * height * 0.05 * variationFactor
    line.position.z = zPosition

    // Create a holder group for x/y jitter
    const orbitHolder = new THREE.Group()
    // Make x/y jitter very subtle, but random, for organic look
    const maxXYJitter = 0.01 // Try 0.01 for a pixel or two
    orbitHolder.position.x += rand() * maxXYJitter * variationFactor
    orbitHolder.position.y += rand() * maxXYJitter * variationFactor
    orbitHolder.add(line)
    orbitGroup.add(orbitHolder)
  }

  if (typeof options.zPosition === 'number') orbitGroup.position.z += options.zPosition

  return orbitGroup
}
