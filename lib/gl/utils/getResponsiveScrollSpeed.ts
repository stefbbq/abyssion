/**
 * Calculate responsive scroll speed based on screen width
 * Ensures logo stays centered between header and content across different screen sizes
 */
export const getResponsiveScrollSpeed = (width: number): number => {
  const breakpoints = [
    { width: 440, speed: -0.0075 },
    { width: 800, speed: -0.0035 },
    { width: 1200, speed: -0.0020 },
    { width: 1440, speed: -0.0018 },
    { width: 1920, speed: -0.0019 },
    { width: 2560, speed: -0.0020 },
  ]

  // Find the appropriate speed range for interpolation
  let lowerBound = breakpoints[0]
  let upperBound = breakpoints[breakpoints.length - 1]

  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (width >= breakpoints[i].width && width <= breakpoints[i + 1].width) {
      lowerBound = breakpoints[i]
      upperBound = breakpoints[i + 1]
      break
    }
  }

  // Handle edge cases
  if (width <= breakpoints[0].width) {
    return breakpoints[0].speed
  }
  if (width >= breakpoints[breakpoints.length - 1].width) {
    return breakpoints[breakpoints.length - 1].speed
  }

  // Linear interpolation between breakpoints
  const widthRange = upperBound.width - lowerBound.width
  const speedRange = upperBound.speed - lowerBound.speed
  const widthFactor = (width - lowerBound.width) / widthRange

  return lowerBound.speed + (speedRange * widthFactor)
}
