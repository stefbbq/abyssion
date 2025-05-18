export type PerlinNoise = {
  grad3: number[][]
  p: number[]
  perm: number[]
  seed: (seed: number) => void
  noise2D: (x: number, y: number) => number
  fade: (t: number) => number
  lerp: (t: number, a: number, b: number) => number
  grad: (hash: number, x: number, y: number, z: number) => number
}

export const createPerlinNoise = (): PerlinNoise => {
  return {
    grad3: [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1],
    ],
    p: [],
    perm: [],

    seed(seed: number) {
      const p = [] as number[]
      for (let i = 0; i < 256; i++) {
        p[i] = Math.floor(Math.random() * 256)
      }
      // To remove the need for index wrapping, double the permutation table length
      const perm = [] as number[]
      for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255]
      }
      this.p = p
      this.perm = perm
    },

    noise2D(x: number, y: number) {
      // Find unit grid cell containing point
      let X = Math.floor(x) & 255
      let Y = Math.floor(y) & 255
      // Get relative coords of point within cell
      x -= Math.floor(x)
      y -= Math.floor(y)
      // Compute fade curves for each coord
      const u = this.fade(x)
      const v = this.fade(y)
      // Hash coordinates of the 4 square corners
      const A = this.perm[X] + Y
      const AA = this.perm[A]
      const AB = this.perm[A + 1]
      const B = this.perm[X + 1] + Y
      const BA = this.perm[B]
      const BB = this.perm[B + 1]

      // Add blended results from 4 corners of square
      return this.lerp(
        v,
        this.lerp(u, this.grad(this.perm[AA], x, y, 0), this.grad(this.perm[BA], x - 1, y, 0)),
        this.lerp(u, this.grad(this.perm[AB], x, y - 1, 0), this.grad(this.perm[BB], x - 1, y - 1, 0)),
      )
    },

    fade(t: number) {
      return t * t * t * (t * (t * 6 - 15) + 10)
    },

    lerp(t: number, a: number, b: number) {
      return a + t * (b - a)
    },

    grad(hash: number, x: number, y: number, z: number) {
      // Convert lower 4 bits of hash into 12 gradient directions
      const h = hash & 15
      const u = h < 8 ? x : y
      const v = h < 4 ? y : (h === 12 || h === 14 ? x : z)
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
    },
  }
}

export const initializeNoise = () => {
  const noise = createPerlinNoise()
  noise.seed(Math.random())
  return noise
}
