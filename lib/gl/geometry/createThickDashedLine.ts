import * as Three from 'three'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Creates a thick dashed line using ribbon geometry (mesh-based)
 * This works around WebGL's 1px line limitation
 */
export const createThickDashedLine = (
  THREE: typeof Three,
  curve: Three.Curve<Three.Vector2>,
  options: {
    color: number
    opacity: number
    thickness: number
    dashSize: number
    gapSize: number
  },
) => {
  const { color, opacity, thickness, dashSize, gapSize } = options

  // get points along the curve
  const points = curve.getPoints(256) // higher resolution for smooth curves

  // calculate total length
  let totalLength = 0
  const segmentLengths: number[] = []
  for (let i = 1; i < points.length; i++) {
    const length = points[i].distanceTo(points[i - 1])
    segmentLengths.push(length)
    totalLength += length
  }

  log(lc.GL_GEOMETRY, `createThickDashedLine: curve analysis`, {
    totalLength,
    dashSize,
    gapSize,
    expectedDashes: Math.floor(totalLength / (dashSize + gapSize)),
    dashPercent: (dashSize / (dashSize + gapSize) * 100).toFixed(1) + '%',
  })

  // create mesh group for dashed segments
  const group = new THREE.Group()

  // track current position along curve
  let currentDistance = 0
  let dashCount = 0

  // create dash segments
  while (currentDistance < totalLength) {
    const dashStart = currentDistance
    const dashEnd = currentDistance + dashSize

    log(lc.GL_GEOMETRY, `Creating dash ${dashCount}`, {
      start: dashStart,
      end: dashEnd,
      nextGapEnd: dashEnd + gapSize,
    })

    // collect points for this dash by interpolating along the curve
    const dashPoints: Three.Vector3[] = []

    // sample points along the dash
    const samplesPerDash = Math.max(2, Math.ceil(dashSize / 0.05)) // at least 2 points, more for longer dashes
    for (let j = 0; j <= samplesPerDash; j++) {
      const t = dashStart / totalLength + (j / samplesPerDash) * (dashSize / totalLength)
      if (t <= 1) {
        const point2d = curve.getPoint(t)
        dashPoints.push(new THREE.Vector3(point2d.x, point2d.y, 0))
      }
    }

    // create ribbon geometry for this dash
    if (dashPoints.length >= 2) {
      const ribbonGeometry = new THREE.BufferGeometry()
      const vertices: number[] = []
      const normals: number[] = []

      for (let i = 0; i < dashPoints.length; i++) {
        const point = dashPoints[i]

        // calculate perpendicular direction
        let direction: Three.Vector3
        if (i === 0) {
          direction = new THREE.Vector3().subVectors(dashPoints[1], dashPoints[0])
        } else if (i === dashPoints.length - 1) {
          direction = new THREE.Vector3().subVectors(dashPoints[i], dashPoints[i - 1])
        } else {
          direction = new THREE.Vector3().subVectors(dashPoints[i + 1], dashPoints[i - 1])
        }

        // perpendicular in 2D (rotate 90 degrees)
        const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize()

        // create two vertices for the ribbon
        const offset = perpendicular.multiplyScalar(thickness / 2)

        vertices.push(
          point.x + offset.x,
          point.y + offset.y,
          point.z,
          point.x - offset.x,
          point.y - offset.y,
          point.z,
        )

        // normals pointing up
        normals.push(0, 0, 1, 0, 0, 1)
      }

      // create indices for triangle strip
      const indices: number[] = []
      for (let i = 0; i < dashPoints.length - 1; i++) {
        const baseIndex = i * 2
        indices.push(
          baseIndex,
          baseIndex + 1,
          baseIndex + 2,
          baseIndex + 1,
          baseIndex + 3,
          baseIndex + 2,
        )
      }

      ribbonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      ribbonGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
      ribbonGeometry.setIndex(indices)

      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(ribbonGeometry, material)
      group.add(mesh)

      log(lc.GL_GEOMETRY, `Created dash ${dashCount} mesh with ${dashPoints.length} points`)
      dashCount++
    }

    // move to next dash
    currentDistance = dashEnd + gapSize
  }

  log(lc.GL_GEOMETRY, `Finished creating dashed line with ${dashCount} dashes`)

  return group
}
