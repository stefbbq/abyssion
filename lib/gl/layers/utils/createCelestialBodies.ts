import * as Three from 'three'
import { createCircleOutline } from '@libgl/geometry/index.ts'
import { GeometricOptions } from '@libgl/layers/GeometricLayer.ts'
import { getCelestialBodiesConfig } from '@libgl/layers/config.ts'

/**
 * Creates celestial bodies that orbit the logo
 */
export const createCelestialBodies = (
  THREE: typeof Three,
  options: GeometricOptions = getCelestialBodiesConfig(),
) => {
  const {
    radius = 1,
    minRadius = 0.5,
    maxRadius = 1.5,
    height = 0.5,
    color = 0x00ffff,
    secondaryColor = 0xff00ff,
    rotationAngle = 0,
    opacity = 0.8,
    minOpacity = 0.1,
    maxOpacity = 1,
    planarDistribution = false,
    variationFactor = 1,
    scale = 1,
  } = options

  const bodyGroup = new THREE.Group()
  const bodyCount = 3
  bodyGroup.rotation.x = rotationAngle

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  for (let i = 0; i < bodyCount; i++) {
    const t = Number(bodyCount) === 1 ? 0.5 : i / (bodyCount - 1)
    // Interpolate radius and opacity
    const rMin = lerp(radius, minRadius, t)
    const rMax = lerp(radius, maxRadius, t)
    const baseRadius = lerp(rMin, rMax, variationFactor)
    const distance = baseRadius
    const oMin = lerp(opacity, minOpacity, t)
    const oMax = lerp(opacity, maxOpacity, t)
    const baseOpacity = lerp(oMin, oMax, variationFactor)
    const planetOpacity = baseOpacity

    const angle = (i / bodyCount) * Math.PI * 2
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    const z = planarDistribution ? 0 : (i - 1) * height * 0.4 * variationFactor
    const size = (0.2 + i * 0.15) * scale
    let body

    if (i === 0) {
      body = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: Math.min(planetOpacity + 0.1, 1),
        }),
      )
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(size, size * 2, 32),
        new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: Math.max(planetOpacity - 0.2, 0),
          side: THREE.DoubleSide,
        }),
      )
      body.add(halo)
    } else {
      body = new THREE.Mesh(
        createCircleOutline(THREE, size, 32, size * 0.1),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? color : secondaryColor,
          transparent: true,
          opacity: planetOpacity,
          wireframe: i === 2,
        }),
      )
    }
    body.position.set(x, y, z)
    if (!planarDistribution) {
      body.rotation.x = Math.PI * 0.1 * variationFactor
      body.rotation.y = Math.PI / 3 * i * variationFactor
    }
    const rotSpeed = 0.3 * (i === 0 ? -1 : 1)
    body.userData = { rotSpeed }
    bodyGroup.add(body)
  }

  return bodyGroup
}
