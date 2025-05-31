import { assertAlmostEquals, assertEquals } from '$std/assert/mod.ts'
import { calculateRotationInterpolation } from '../calculateRotationInterpolation.ts'

Deno.test('calculateRotationInterpolation - basic interpolation', async (test) => {
  await test.step('should interpolate toward target', () => {
    const current = 0
    const target = 10
    const smoothing = 0.1

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 1.0) // 0 + (10 - 0) * 0.1
  })

  await test.step('should use default smoothing factor', () => {
    const current = 0
    const target = 10

    const result = calculateRotationInterpolation(current, target)

    assertEquals(result, 0.5) // 0 + (10 - 0) * 0.05 (default)
  })

  await test.step('should handle negative values', () => {
    const current = 5
    const target = -5
    const smoothing = 0.2

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 3.0) // 5 + (-5 - 5) * 0.2 = 5 + (-10) * 0.2 = 5 - 2 = 3
  })
})

Deno.test('calculateRotationInterpolation - convergence behavior', async (test) => {
  await test.step('should converge to target over multiple steps', () => {
    let current = 0
    const target = 100
    const smoothing = 0.1

    // Apply interpolation multiple times
    for (let i = 0; i < 5; i++) {
      current = calculateRotationInterpolation(current, target, smoothing)
    }

    // Should be closer to target but not quite there
    assertAlmostEquals(current, 40.951, 0.001) // Calculated convergence value
  })

  await test.step('should not overshoot target', () => {
    const current = 0
    const target = 1
    const smoothing = 0.5

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 0.5) // Halfway to target
  })

  await test.step('should handle when current equals target', () => {
    const current = 42
    const target = 42
    const smoothing = 0.1

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 42) // No change when already at target
  })
})

Deno.test('calculateRotationInterpolation - smoothing factor effects', async (test) => {
  await test.step('should move faster with higher smoothing', () => {
    const current = 0
    const target = 10

    const result1 = calculateRotationInterpolation(current, target, 0.1)
    const result2 = calculateRotationInterpolation(current, target, 0.5)

    assertEquals(result1, 1.0) // 10% of the way
    assertEquals(result2, 5.0) // 50% of the way
  })

  await test.step('should handle zero smoothing', () => {
    const current = 5
    const target = 15
    const smoothing = 0

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 5) // No movement with zero smoothing
  })

  await test.step('should handle full smoothing', () => {
    const current = 5
    const target = 15
    const smoothing = 1.0

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 15) // Jump directly to target with full smoothing
  })
})

Deno.test('calculateRotationInterpolation - edge cases', async (test) => {
  await test.step('should handle very small differences', () => {
    const current = 1.0000001
    const target = 1.0000002
    const smoothing = 0.5

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertAlmostEquals(result, 1.00000015, 0.00000001)
  })

  await test.step('should handle large values', () => {
    const current = 1000000
    const target = 2000000
    const smoothing = 0.1

    const result = calculateRotationInterpolation(current, target, smoothing)

    assertEquals(result, 1100000) // 1000000 + (2000000 - 1000000) * 0.1
  })
})
