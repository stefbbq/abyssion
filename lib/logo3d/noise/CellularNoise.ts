import { createPseudoRandom } from './NoiseUtils.ts'

/**
 * cellular noise (Worley/Voronoi) for organic cellular patterns
 */
export type CellularNoise = {
  seed: number
  scale: number
  jitter: number
  points: Array<[number, number]>
  randomize: () => void
  setValue: (seed: number) => void
  getValue: (x: number, y: number) => number
}

export const createCellularNoise = (
  scale = 1.0,
  jitter = 1.0,
): CellularNoise => {
  const generatePoints = (seed: number, jitter: number) => {
    const random = createPseudoRandom(seed)
    const points: Array<[number, number]> = []

    // create grid of points with some randomness
    const gridSize = 8
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const jx = jitter * (random() - 0.5) / gridSize
        const jy = jitter * (random() - 0.5) / gridSize

        points.push([
          (x + 0.5) / gridSize + jx,
          (y + 0.5) / gridSize + jy,
        ])
      }
    }

    return points
  }

  let currentSeed = Math.floor(Math.random() * 10000)
  const points = generatePoints(currentSeed, jitter)

  return {
    seed: currentSeed,
    scale,
    jitter,
    points,

    randomize() {
      this.seed = Math.floor(Math.random() * 10000)
      this.points = generatePoints(this.seed, this.jitter)
    },

    setValue(seed: number) {
      this.seed = seed
      this.points = generatePoints(this.seed, this.jitter)
    },

    getValue(x: number, y: number) {
      // scale the coordinates
      x = (x * this.scale) % 1
      y = (y * this.scale) % 1

      if (x < 0) x += 1
      if (y < 0) y += 1

      // find distance to closest point
      let minDist = 1.5
      let secondMinDist = 1.5

      for (const point of this.points) {
        // calculate distance considering wrapping at boundaries
        let dx = Math.abs(point[0] - x)
        let dy = Math.abs(point[1] - y)

        // handle wrapping at boundaries
        if (dx > 0.5) dx = 1 - dx
        if (dy > 0.5) dy = 1 - dy

        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < minDist) {
          secondMinDist = minDist
          minDist = dist
        } else if (dist < secondMinDist) {
          secondMinDist = dist
        }
      }

      // use difference between closest and second closest for cell edges
      return Math.min(secondMinDist - minDist, 1)
    },
  }
}
