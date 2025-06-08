import * as Three from 'three'
import { GeometricOptions } from '@libgl/layers/GeometricLayer.ts'
import { getConcentricRingsConfig } from '@libgl/layers/config.ts'

/**
 * Creates concentric rings with configurable properties
 */
export const createConcentricRings = (
  THREE: typeof Three,
  options: GeometricOptions = getConcentricRingsConfig(),
) => {
  const {
    radius = 1,
    minRadius = 0.5,
    maxRadius = 1.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.4,
    minOpacity = 0.1,
    maxOpacity = 1,
    segments = 128,
    variationFactor = 1,
    thickness: customThickness,
  } = options

  const ringGroup = new THREE.Group()
  const ringCount = 6

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  for (let i = 0; i < ringCount; i++) {
    const t = Number(ringCount) === 1 ? 0.5 : i / (ringCount - 1)
    const rMin = lerp(radius, minRadius, t)
    const rMax = lerp(radius, maxRadius, t)
    const baseRadius = lerp(rMin, rMax, variationFactor)
    const ringRadius = baseRadius
    const oMin = lerp(opacity, minOpacity, t)
    const oMax = lerp(opacity, maxOpacity, t)
    const baseOpacity = lerp(oMin, oMax, variationFactor)
    const ringOpacity = baseOpacity
    const thickness = customThickness || (0.01 + (i % 3 === 0 ? 0.015 : 0.005))

    const ringGeometry = new THREE.TorusGeometry(ringRadius, thickness, 6, segments)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: i % 3 === 1 ? secondaryColor : color,
      transparent: true,
      opacity: ringOpacity,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = 0 + rotationAngle
    ring.rotation.z = variationFactor * (Math.PI * 0.05 * i * 0.3)
    ringGroup.add(ring)
  }

  return ringGroup
}
