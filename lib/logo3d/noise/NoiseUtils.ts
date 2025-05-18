/**
 * creates a seeded pseudo-random number generator
 */
export const createPseudoRandom = (seed: number) => {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
