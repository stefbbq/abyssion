import { assert, assertAlmostEquals, assertEquals } from '$std/assert/mod.ts'
import { smoothRotationInterpolation } from '../smoothRotationInterpolation.ts'

Deno.test('smoothRotationInterpolation - basic functionality', async (test) => {
  await test.step('should interpolate toward target with default smoothing', () => {
    const current = 0
    const target = 10
    const result = smoothRotationInterpolation(current, target)

    assertEquals(result, 0.5) // 0 + (10 - 0) * 0.05 (default smoothing)
  })

  await test.step('should interpolate toward target with custom smoothing', () => {
    const current = 0
    const target = 10
    const smoothing = 0.2
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 2.0) // 0 + (10 - 0) * 0.2
  })

  await test.step('should handle negative values', () => {
    const current = 5
    const target = -5
    const smoothing = 0.1
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 4.0) // 5 + (-5 - 5) * 0.1 = 5 + (-10) * 0.1 = 5 - 1 = 4
  })

  await test.step('should handle negative current value', () => {
    const current = -10
    const target = 0
    const smoothing = 0.2
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, -8.0) // -10 + (0 - (-10)) * 0.2 = -10 + 10 * 0.2 = -10 + 2 = -8
  })
})

Deno.test('smoothRotationInterpolation - convergence behavior', async (test) => {
  await test.step('should converge to target over multiple steps', () => {
    let current = 0
    const target = 100
    const smoothing = 0.1

    // Apply interpolation multiple times
    for (let i = 0; i < 10; i++) {
      current = smoothRotationInterpolation(current, target, smoothing)
    }

    // Should be closer to target but not quite there
    assertAlmostEquals(current, 65.132, 0.001) // Calculated convergence value
  })

  await test.step('should not overshoot target with reasonable smoothing', () => {
    const current = 0
    const target = 1
    const smoothing = 0.5

    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 0.5) // Halfway to target, should not overshoot
  })

  await test.step('should approach target asymptotically', () => {
    let current = 0
    const target = 10
    const smoothing = 0.1

    const values = []
    for (let i = 0; i < 20; i++) {
      current = smoothRotationInterpolation(current, target, smoothing)
      values.push(current)
    }

    // Each step should be closer to target than previous
    for (let i = 1; i < values.length; i++) {
      const distancePrev = Math.abs(target - values[i - 1])
      const distanceCurr = Math.abs(target - values[i])
      assert(distanceCurr <= distancePrev, `Step ${i} should be closer to target`)
    }

    // Should be very close to target after many steps
    assertAlmostEquals(current, target, 2.0) // Within 2 units (more lenient for asymptotic approach)
  })
})

Deno.test('smoothRotationInterpolation - smoothing factor effects', async (test) => {
  await test.step('should move faster with higher smoothing factor', () => {
    const current = 0
    const target = 10

    const result1 = smoothRotationInterpolation(current, target, 0.1)
    const result2 = smoothRotationInterpolation(current, target, 0.5)

    assertEquals(result1, 1.0) // 10% of the way
    assertEquals(result2, 5.0) // 50% of the way
    assert(result2 > result1, 'Higher smoothing should result in larger step')
  })

  await test.step('should handle zero smoothing factor', () => {
    const current = 5
    const target = 15
    const smoothing = 0
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 5) // No movement with zero smoothing
  })

  await test.step('should handle full smoothing factor', () => {
    const current = 5
    const target = 15
    const smoothing = 1.0
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 15) // Jump directly to target with full smoothing
  })

  await test.step('should handle smoothing factor greater than 1', () => {
    const current = 0
    const target = 10
    const smoothing = 1.5 // Overshoot factor
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 15) // 0 + (10 - 0) * 1.5 = 15 (overshoots target)
  })
})

Deno.test('smoothRotationInterpolation - edge cases', async (test) => {
  await test.step('should handle when current equals target', () => {
    const current = 42
    const target = 42
    const smoothing = 0.1
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 42) // No change when already at target
  })

  await test.step('should handle very small differences', () => {
    const current = 1.0000001
    const target = 1.0000002
    const smoothing = 0.5
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertAlmostEquals(result, 1.00000015, 0.00000001) // Precise interpolation
  })

  await test.step('should handle large values', () => {
    const current = 1000000
    const target = 2000000
    const smoothing = 0.1
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 1100000) // 1000000 + (2000000 - 1000000) * 0.1
  })

  await test.step('should handle very small smoothing factors', () => {
    const current = 0
    const target = 1000
    const smoothing = 0.001
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertEquals(result, 1.0) // 0 + (1000 - 0) * 0.001 = 1
  })

  await test.step('should handle floating point precision', () => {
    const current = 0.1 + 0.2 // 0.30000000000000004 in JS
    const target = 0.3
    const smoothing = 1.0
    const result = smoothRotationInterpolation(current, target, smoothing)

    assertAlmostEquals(result, 0.3, 0.000001) // Should reach target despite floating point issues
  })
})

Deno.test('smoothRotationInterpolation - mathematical properties', async (test) => {
  await test.step('should be commutative for opposite directions', () => {
    const value1 = 10
    const value2 = 20
    const smoothing = 0.3

    const result1 = smoothRotationInterpolation(value1, value2, smoothing)
    const result2 = smoothRotationInterpolation(value2, value1, smoothing)

    // Distance moved should be same magnitude but opposite direction
    const distance1 = result1 - value1
    const distance2 = result2 - value2
    assertAlmostEquals(Math.abs(distance1), Math.abs(distance2), 0.001)
    assert(distance1 > 0, 'Should move toward higher value')
    assert(distance2 < 0, 'Should move toward lower value')
  })

  await test.step('should be linear with respect to difference', () => {
    const current = 0
    const smoothing = 0.2

    const result1 = smoothRotationInterpolation(current, 10, smoothing)
    const result2 = smoothRotationInterpolation(current, 20, smoothing)

    assertEquals(result2, result1 * 2) // Double the target, double the result
  })

  await test.step('should be linear with respect to smoothing factor', () => {
    const current = 0
    const target = 10

    const result1 = smoothRotationInterpolation(current, target, 0.1)
    const result2 = smoothRotationInterpolation(current, target, 0.2)

    assertEquals(result2, result1 * 2) // Double the smoothing, double the result
  })
})
