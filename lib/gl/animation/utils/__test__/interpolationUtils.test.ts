import { assert, assertAlmostEquals, assertEquals } from '$std/assert/mod.ts'
import { easeInOut, easeOut, lerp, smoothRotationInterpolation } from '../interpolationUtils.ts'

Deno.test('lerp - linear interpolation', async (test) => {
  await test.step('should interpolate linearly between start and end', () => {
    assertEquals(lerp(0, 10, 0), 0) // Factor 0 = start
    assertEquals(lerp(0, 10, 1), 10) // Factor 1 = end
    assertEquals(lerp(0, 10, 0.5), 5) // Factor 0.5 = middle
    assertEquals(lerp(0, 10, 0.25), 2.5) // Factor 0.25 = quarter
  })

  await test.step('should handle negative values', () => {
    assertEquals(lerp(-10, 10, 0.5), 0) // Middle of -10 to 10
    assertEquals(lerp(10, -10, 0.5), 0) // Middle of 10 to -10
    assertEquals(lerp(-20, -10, 0.5), -15) // Middle of -20 to -10
  })

  await test.step('should handle factors outside 0-1 range', () => {
    assertEquals(lerp(0, 10, -0.5), -5) // Extrapolate backward
    assertEquals(lerp(0, 10, 1.5), 15) // Extrapolate forward
  })

  await test.step('should handle same start and end values', () => {
    assertEquals(lerp(5, 5, 0.3), 5) // Should always return same value
    assertEquals(lerp(5, 5, 1.7), 5) // Even with factor > 1
  })

  await test.step('should handle floating point precision', () => {
    assertAlmostEquals(lerp(0.1, 0.2, 0.5), 0.15, 0.000001)
    assertAlmostEquals(lerp(1.234, 5.678, 0.25), 2.345, 0.001)
  })
})

Deno.test('easeOut - cubic ease-out function', async (test) => {
  await test.step('should return correct values at key points', () => {
    assertEquals(easeOut(0), 0) // Start
    assertEquals(easeOut(1), 1) // End
    assertAlmostEquals(easeOut(0.5), 0.875, 0.001) // Middle: 1 - (1-0.5)^3 = 1 - 0.125
  })

  await test.step('should provide smooth deceleration curve', () => {
    // Early values should change more rapidly than later values
    const early = easeOut(0.2)
    const late = easeOut(0.8)

    const earlyRate = early - easeOut(0.1) // Change from 0.1 to 0.2
    const lateRate = easeOut(0.9) - late // Change from 0.8 to 0.9

    assert(earlyRate > lateRate, 'Early changes should be larger than late changes (ease-out)')
  })

  await test.step('should handle edge cases', () => {
    // Test values slightly outside normal range
    assertAlmostEquals(easeOut(-0.1), -0.331, 0.01) // 1 - (1-(-0.1))^3
    assertAlmostEquals(easeOut(1.1), 1.001, 0.01) // 1 - (1-1.1)^3 = 1 - (-0.1)^3 = 1 - (-0.001) = 1.001
  })

  await test.step('should be monotonically increasing', () => {
    const values = []
    for (let i = 0; i <= 10; i++) {
      values.push(easeOut(i / 10))
    }

    // Each value should be >= previous value
    for (let i = 1; i < values.length; i++) {
      assert(values[i] >= values[i - 1], `Value at ${i / 10} should be >= previous`)
    }
  })
})

Deno.test('easeInOut - cubic ease-in-out function', async (test) => {
  await test.step('should return correct values at key points', () => {
    assertEquals(easeInOut(0), 0) // Start
    assertEquals(easeInOut(1), 1) // End
    assertEquals(easeInOut(0.5), 0.5) // Middle should be exactly 0.5
  })

  await test.step('should be symmetric around 0.5', () => {
    // Test symmetry: f(x) + f(1-x) should equal 1
    const testPoints = [0.1, 0.2, 0.3, 0.4]

    for (const x of testPoints) {
      const leftValue = easeInOut(x)
      const rightValue = easeInOut(1 - x)
      assertAlmostEquals(leftValue + rightValue, 1, 0.001, `Symmetry at ${x}`)
    }
  })

  await test.step('should ease in then ease out', () => {
    // First half should accelerate (ease in)
    const quarter = easeInOut(0.25)
    const expectedQuarter = 4 * 0.25 * 0.25 * 0.25 // 4t³ for t < 0.5
    assertAlmostEquals(quarter, expectedQuarter, 0.001)

    // Second half should decelerate (ease out)
    const threeQuarter = easeInOut(0.75)
    const t = 0.75
    const expected = 1 - Math.pow(-2 * t + 2, 3) / 2
    assertAlmostEquals(threeQuarter, expected, 0.001)
  })

  await test.step('should be monotonically increasing', () => {
    const values = []
    for (let i = 0; i <= 20; i++) {
      values.push(easeInOut(i / 20))
    }

    // Each value should be >= previous value
    for (let i = 1; i < values.length; i++) {
      assert(values[i] >= values[i - 1], `Value at ${i / 20} should be >= previous`)
    }
  })

  await test.step('should have smooth transition at midpoint', () => {
    // Values around 0.5 should be close to 0.5
    assertAlmostEquals(easeInOut(0.49), 0.4706, 0.01)
    assertAlmostEquals(easeInOut(0.51), 0.5294, 0.01)
  })
})

Deno.test('smoothRotationInterpolation - duplicate function test', async (test) => {
  await test.step('should match standalone implementation behavior', () => {
    const current = 10
    const target = 20
    const smoothing = 0.3

    const result = smoothRotationInterpolation(current, target, smoothing)
    const expected = current + (target - current) * smoothing

    assertEquals(result, expected)
  })

  await test.step('should use default smoothing factor', () => {
    const current = 0
    const target = 100

    const result = smoothRotationInterpolation(current, target)
    const expected = current + (target - current) * 0.05 // Default smoothing

    assertEquals(result, expected)
  })
})

Deno.test('interpolation functions - comparison and composition', async (test) => {
  await test.step('should show different curves for different functions', () => {
    const factor = 0.5

    const linearResult = lerp(0, 1, factor)
    const easeOutResult = easeOut(factor)
    const easeInOutResult = easeInOut(factor)

    assertEquals(linearResult, 0.5)
    assertAlmostEquals(easeOutResult, 0.875, 0.001)
    assertEquals(easeInOutResult, 0.5)

    // Ease-out should be ahead of linear at midpoint
    assert(easeOutResult > linearResult, 'Ease-out should be ahead of linear at 0.5')
  })

  await test.step('should compose well with lerp', () => {
    const start = 100
    const end = 200
    const factor = 0.3

    // Linear interpolation
    const linear = lerp(start, end, factor)

    // Eased interpolation using ease-out
    const eased = lerp(start, end, easeOut(factor))

    assert(eased > linear, 'Eased interpolation should be ahead of linear with ease-out')
    assertEquals(linear, 130) // 100 + (200-100) * 0.3
  })

  await test.step('should handle edge case combinations', () => {
    // Test combining extreme values
    const verySmall = lerp(-1000, 1000, easeOut(0.001))
    const veryLarge = lerp(-1000, 1000, easeInOut(0.999))

    assert(verySmall > -1000, 'Should move away from start')
    assert(verySmall < 1000, 'Should not reach end')
    assert(veryLarge > -1000, 'Should move away from start')
    assert(veryLarge < 1000, 'Should not quite reach end')
  })
})
