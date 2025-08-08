/**
 * calculates a scroll speed that keeps the logo visually "sandwiched" between the header
 * and the first content block as you begin to scroll.
 *
 * strategy
 * - start with a width-calibrated baseline (empirical tuning by breakpoints)
 * - apply a height-based correction so different viewport heights maintain similar screen-space motion
 * - keep it monotonic and clamp the extremes to avoid over- or under-scrolling on very small/large screens
 */
export const getResponsiveScrollSpeed = (width: number, height: number): number => {
  // width-driven baseline based on existing tuning
  const breakpoints = [
    { width: 440, speed: -0.0075 },
    { width: 800, speed: -0.0035 },
    { width: 1200, speed: -0.0020 },
    { width: 1440, speed: -0.0018 },
    { width: 1920, speed: -0.0019 },
    { width: 2560, speed: -0.0020 },
  ]

  const clamp = (value: number, min: number, max: number) => value < min ? min : value > max ? max : value

  // find the appropriate speed range for interpolation
  let lowerBound = breakpoints[0]
  let upperBound = breakpoints[breakpoints.length - 1]

  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (width >= breakpoints[i].width && width <= breakpoints[i + 1].width) {
      lowerBound = breakpoints[i]
      upperBound = breakpoints[i + 1]
      break
    }
  }

  // handle width edges directly
  const baseSpeed = (() => {
    if (width <= breakpoints[0].width) return breakpoints[0].speed
    if (width >= breakpoints[breakpoints.length - 1].width) return breakpoints[breakpoints.length - 1].speed

    // linear interpolation between breakpoints
    const widthRange = upperBound.width - lowerBound.width
    const speedRange = upperBound.speed - lowerBound.speed
    const widthFactor = (width - lowerBound.width) / widthRange
    return lowerBound.speed + (speedRange * widthFactor)
  })()

  // height correction
  // referenceHeight is where the original tuning "feels" right
  const referenceHeight = 900
  const safeHeight = Math.max(height || referenceHeight, 360)

  // exponent < 1 softens the correction so it does not feel too aggressive
  const heightExponent = 0.9
  const rawHeightFactor = Math.pow(referenceHeight / safeHeight, heightExponent)

  // keep within sensible bounds
  const heightFactor = clamp(rawHeightFactor, 0.7, 1.4)

  // additional small adjustment for extreme aspect ratios
  const aspect = width > 0 && safeHeight > 0 ? width / safeHeight : 16 / 9
  const ultraWideBoost = aspect > 2.0 ? clamp((aspect - 2.0) * 0.12 + 1, 1, 1.25) : 1

  return baseSpeed * heightFactor * ultraWideBoost
}
