// Common noise generator interface
export type NoiseGenerator = {
  getValue: (x: number, y: number) => number
  setValue?: (seed: number) => void
}
