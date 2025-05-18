import { createPseudoRandom } from './NoiseUtils.ts'

/**
 * scratch noise generator for creating random scratch patterns
 */
export type ScratchNoise = {
  seed: number
  density: number
  length: number
  width: number
  angle: number
  randomize: () => void
  setValue: (seed: number) => void
  getValue: (x: number, y: number) => number
}

export const createScratchNoise = (
  density = 0.5,
  length = 0.2,
  width = 0.02,
  angle = 0,
): ScratchNoise => {
  const scratchData: Array<{
    x: number
    y: number
    length: number
    angle: number
    width: number
  }> = []

  const generateScratches = (seed: number, density: number, length: number, width: number, angle: number) => {
    const random = createPseudoRandom(seed)
    scratchData.length = 0

    // generate scratch locations based on density
    const numScratches = Math.floor(50 * density)

    for (let i = 0; i < numScratches; i++) {
      const scratch = {
        x: random() * 2 - 1,
        y: random() * 2 - 1,
        length: length * (0.5 + random() * 0.5),
        angle: angle + (random() * Math.PI * 0.5 - Math.PI * 0.25),
        width: width * (0.5 + random() * 0.5),
      }
      scratchData.push(scratch)
    }
  }

  let currentSeed = Math.floor(Math.random() * 10000)
  generateScratches(currentSeed, density, length, width, angle)

  return {
    seed: currentSeed,
    density,
    length,
    width,
    angle,

    randomize() {
      this.seed = Math.floor(Math.random() * 10000)
      generateScratches(this.seed, this.density, this.length, this.width, this.angle)
    },

    setValue(seed: number) {
      this.seed = seed
      generateScratches(this.seed, this.density, this.length, this.width, this.angle)
    },

    getValue(x: number, y: number) {
      // normalize coordinates to -1 to 1 range
      x = (x % 1) * 2 - 1
      y = (y % 1) * 2 - 1

      let value = 0

      for (const scratch of scratchData) {
        // transform point based on scratch angle
        const cosA = Math.cos(scratch.angle)
        const sinA = Math.sin(scratch.angle)

        const dx = x - scratch.x
        const dy = y - scratch.y

        // rotate point
        const rx = dx * cosA - dy * sinA
        const ry = dx * sinA + dy * cosA

        // check if point is within scratch bounds
        if (
          Math.abs(rx) < scratch.length &&
          Math.abs(ry) < scratch.width
        ) {
          // smooth falloff toward edges
          const edgeX = 1 - Math.abs(rx / scratch.length)
          const edgeY = 1 - Math.abs(ry / scratch.width)
          const edge = Math.min(edgeX, edgeY)
          value = Math.max(value, edge)
        }
      }

      return value
    },
  }
}
