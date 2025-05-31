import { assert, assertEquals } from '$std/assert/mod.ts'
import { calculateRegenerationTiming } from '../calculateRegenerationTiming.ts'

Deno.test('calculateRegenerationTiming - should not regenerate', async (test) => {
  await test.step('should not regenerate when interval not exceeded', () => {
    const currentTime = 5000
    const lastRegenerateTime = 3000
    const nextRegenerateInterval = 3000 // 3 seconds

    const result = calculateRegenerationTiming(currentTime, lastRegenerateTime, nextRegenerateInterval)

    assertEquals(result.shouldRegenerate, false)
    assertEquals(result.newInterval, nextRegenerateInterval) // Should keep same interval
  })

  await test.step('should not regenerate at exact boundary', () => {
    const currentTime = 5000
    const lastRegenerateTime = 2000
    const nextRegenerateInterval = 3000

    const result = calculateRegenerationTiming(currentTime, lastRegenerateTime, nextRegenerateInterval)

    assertEquals(result.shouldRegenerate, false)
    assertEquals(result.newInterval, nextRegenerateInterval)
  })
})

Deno.test('calculateRegenerationTiming - should regenerate', async (test) => {
  await test.step('should regenerate when interval exceeded', () => {
    const currentTime = 6000
    const lastRegenerateTime = 2000
    const nextRegenerateInterval = 3000 // 6000 - 2000 = 4000 > 3000

    const result = calculateRegenerationTiming(currentTime, lastRegenerateTime, nextRegenerateInterval)

    assertEquals(result.shouldRegenerate, true)
    // New interval should be between 1000ms and 4000ms (1s + 0-3s random)
    assert(result.newInterval >= 1000)
    assert(result.newInterval <= 4000)
  })

  await test.step('should generate new random interval when regenerating', () => {
    const currentTime = 10000
    const lastRegenerateTime = 5000
    const nextRegenerateInterval = 2000

    // Run multiple times to ensure randomness
    const results = []
    for (let i = 0; i < 10; i++) {
      const result = calculateRegenerationTiming(currentTime, lastRegenerateTime, nextRegenerateInterval)
      results.push(result.newInterval)
    }

    // All should be in valid range
    results.forEach((interval) => {
      assert(interval >= 1000)
      assert(interval <= 4000)
    })

    // Should have some variance (not all the same)
    const uniqueValues = new Set(results)
    assert(uniqueValues.size > 1, 'Should generate different random intervals')
  })
})

Deno.test('calculateRegenerationTiming - edge cases', async (test) => {
  await test.step('should handle zero time values', () => {
    const result = calculateRegenerationTiming(0, 0, 1000)
    assertEquals(result.shouldRegenerate, false)
    assertEquals(result.newInterval, 1000)
  })

  await test.step('should handle very large time differences', () => {
    const currentTime = 1000000
    const lastRegenerateTime = 0
    const nextRegenerateInterval = 1000

    const result = calculateRegenerationTiming(currentTime, lastRegenerateTime, nextRegenerateInterval)

    assertEquals(result.shouldRegenerate, true)
    assert(result.newInterval >= 1000)
    assert(result.newInterval <= 4000)
  })

  await test.step('should handle minimal exceeded interval', () => {
    const currentTime = 3001
    const lastRegenerateTime = 0
    const nextRegenerateInterval = 3000

    const result = calculateRegenerationTiming(currentTime, lastRegenerateTime, nextRegenerateInterval)

    assertEquals(result.shouldRegenerate, true)
    assert(result.newInterval >= 1000)
    assert(result.newInterval <= 4000)
  })
})
