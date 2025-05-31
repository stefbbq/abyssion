import { assert, assertEquals } from '$std/assert/mod.ts'
import { getRandomInterval } from '../getRandomInterval.ts'

Deno.test('getRandomInterval - basic functionality', async (test) => {
  await test.step('should return value between default min and max', () => {
    const result = getRandomInterval()
    assert(result >= 1000) // 1s
    assert(result <= 4000) // 4s
    assertEquals(typeof result, 'number')
  })

  await test.step('should return value between custom min and max', () => {
    const result = getRandomInterval('2s', '5s')
    assert(result >= 2000) // 2s
    assert(result <= 5000) // 5s
  })

  await test.step('should handle millisecond format', () => {
    const result = getRandomInterval('500ms', '1500ms')
    assert(result >= 500)
    assert(result <= 1500)
  })

  await test.step('should handle mixed formats', () => {
    const result = getRandomInterval('500ms', '2s')
    assert(result >= 500)
    assert(result <= 2000)
  })
})

Deno.test('getRandomInterval - time format variations', async (test) => {
  await test.step('should handle seconds format', () => {
    const result = getRandomInterval('1s', '3s')
    assert(result >= 1000)
    assert(result <= 3000)
  })

  await test.step('should handle minute format', () => {
    const result = getRandomInterval('1m', '2m')
    assert(result >= 60000) // 1 minute
    assert(result <= 120000) // 2 minutes
  })

  await test.step('should handle hour format', () => {
    const result = getRandomInterval('1h', '2h')
    assert(result >= 3600000) // 1 hour
    assert(result <= 7200000) // 2 hours
  })

  await test.step('should handle decimal values', () => {
    const result = getRandomInterval('1.5s', '2.5s')
    assert(result >= 1500)
    assert(result <= 2500)
  })
})

Deno.test('getRandomInterval - edge cases', async (test) => {
  await test.step('should handle same min and max values', () => {
    const result = getRandomInterval('2s', '2s')
    assertEquals(result, 2000) // Should always be 2000ms
  })

  await test.step('should handle very small intervals', () => {
    const result = getRandomInterval('1ms', '2ms')
    assert(result >= 1)
    assert(result <= 2)
  })

  await test.step('should handle large intervals', () => {
    const result = getRandomInterval('1d', '2d')
    assert(result >= 86400000) // 1 day
    assert(result <= 172800000) // 2 days
  })

  await test.step('should handle zero values', () => {
    const result = getRandomInterval('0ms', '1s')
    assert(result >= 0)
    assert(result <= 1000)
  })

  await test.step('should handle min greater than max (unexpected but should work)', () => {
    // This tests the underlying ms() library behavior
    const result = getRandomInterval('3s', '1s')
    // The result should be between 3000 + random * (1000 - 3000)
    // Which means 3000 + random * (-2000), so between 1000 and 3000
    assert(typeof result === 'number')
    assert(!isNaN(result))
  })
})

Deno.test('getRandomInterval - randomness validation', async (test) => {
  await test.step('should produce different values on multiple calls', () => {
    const results = []
    for (let i = 0; i < 10; i++) {
      results.push(getRandomInterval('1s', '5s'))
    }

    // All should be in range
    results.forEach((result) => {
      assert(result >= 1000)
      assert(result <= 5000)
    })

    // Should have some variation (unlikely to get all same values)
    const uniqueValues = new Set(results)
    assert(uniqueValues.size > 1, 'Should generate different random values')
  })

  await test.step('should be evenly distributed over many calls', () => {
    const results = []
    const min = 1000
    const max = 3000
    const iterations = 1000

    for (let i = 0; i < iterations; i++) {
      results.push(getRandomInterval('1s', '3s'))
    }

    // All should be in range
    results.forEach((result) => {
      assert(result >= min)
      assert(result <= max)
    })

    // Check distribution - should have values across the range
    const lowCount = results.filter((r) => r < min + (max - min) / 3).length
    const midCount = results.filter(
      (r) => r >= min + (max - min) / 3 && r < min + (2 * (max - min)) / 3,
    ).length
    const highCount = results.filter((r) => r >= min + (2 * (max - min)) / 3).length

    // Each third should have some values (loose bounds for randomness)
    assert(lowCount > iterations * 0.1, `Low range underrepresented: ${lowCount}`)
    assert(midCount > iterations * 0.1, `Mid range underrepresented: ${midCount}`)
    assert(highCount > iterations * 0.1, `High range underrepresented: ${highCount}`)
  })
})

Deno.test('getRandomInterval - deterministic behavior properties', async (test) => {
  await test.step('should always return numbers', () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandomInterval()
      assertEquals(typeof result, 'number')
      assert(!isNaN(result))
      assert(isFinite(result))
    }
  })

  await test.step('should respect mathematical bounds', () => {
    for (let i = 0; i < 100; i++) {
      const min = Math.random() * 1000 // Random min up to 1s
      const max = min + Math.random() * 1000 // Random max up to 1s more
      const result = getRandomInterval(`${min}ms`, `${max}ms`)

      assert(result >= min, `Result ${result} should be >= ${min}`)
      assert(result <= max, `Result ${result} should be <= ${max}`)
    }
  })
})
