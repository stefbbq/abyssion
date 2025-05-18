import { createPerlinNoise, PerlinNoise } from './PerlinNoise.ts'

/**
 * distressed noise for weathered, worn textures
 */
export type DistressedNoise = {
  baseNoise: PerlinNoise
  roughness: number
  scale: number
  iterations: number
  setValue: (seed: number) => void
  getValue: (x: number, y: number) => number
}

export const createDistressedNoise = (
  roughness = 0.7,
  scale = 1.0,
  iterations = 3,
): DistressedNoise => {
  const baseNoise = createPerlinNoise()
  baseNoise.seed(Math.floor(Math.random() * 10000))

  return {
    baseNoise,
    roughness,
    scale,
    iterations,

    setValue(seed: number) {
      this.baseNoise.seed(seed)
    },

    getValue(x: number, y: number) {
      // scale the coordinates
      x *= this.scale
      y *= this.scale

      let value = 0
      let amplitude = 1
      let frequency = 1
      let maxValue = 0

      // add fractal layers (octaves)
      for (let i = 0; i < this.iterations; i++) {
        value += this.baseNoise.noise2D(x * frequency, y * frequency) * amplitude
        maxValue += amplitude
        amplitude *= this.roughness
        frequency *= 2
      }

      // normalize
      value /= maxValue

      // adjust for more "distressed" look with sharp transitions
      value = Math.pow(Math.abs(value), 0.5) * Math.sign(value)

      // add some threshold breaks for distressed look
      if (value > 0.2) value = Math.min(value + 0.15, 1.0)
      if (value < -0.2) value = Math.max(value - 0.15, -1.0)

      return value * 0.5 + 0.5 // normalize to 0-1
    },
  }
}
