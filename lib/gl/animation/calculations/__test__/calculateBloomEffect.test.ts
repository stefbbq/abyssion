import { assertAlmostEquals, assertEquals } from '$std/assert/mod.ts'
import { calculateBloomEffect } from '../calculateBloomEffect.ts'

Deno.test('calculateBloomEffect - override active', async (test) => {
  await test.step('should use override intensity when override is active', () => {
    const result = calculateBloomEffect(100, 0.5, 2, 0.2, true, 2.0)
    assertEquals(result, 1.0)
  })

  await test.step('should ignore pulse when override is active', () => {
    const result1 = calculateBloomEffect(0, 0.5, 2, 0.2, true, 1.5)
    const result2 = calculateBloomEffect(Math.PI, 0.5, 2, 0.2, true, 1.5)
    assertEquals(result1, 0.75)
    assertEquals(result2, 0.75) // Same regardless of time
  })
})

Deno.test('calculateBloomEffect - pulse behavior', async (test) => {
  await test.step('should calculate pulse at time 0', () => {
    const result = calculateBloomEffect(0, 0.5, 1, 0.1, false, 0)
    assertEquals(result, 0.5)
  })

  await test.step('should calculate pulse at PI/2', () => {
    const time = Math.PI / 2
    const result = calculateBloomEffect(time, 0.5, 1, 0.1, false, 0)
    assertAlmostEquals(result, 0.6, 0.001)
  })

  await test.step('should calculate pulse at PI', () => {
    const time = Math.PI
    const result = calculateBloomEffect(time, 0.5, 1, 0.1, false, 0)
    assertAlmostEquals(result, 0.5, 0.001)
  })

  await test.step('should handle different frequencies', () => {
    const time = Math.PI / 4 // 45 degrees
    const result = calculateBloomEffect(time, 0.5, 2, 0.2, false, 0)
    assertAlmostEquals(result, 0.7, 0.001)
  })
})

Deno.test('calculateBloomEffect - edge cases', async (test) => {
  await test.step('should handle zero pulse intensity', () => {
    const result = calculateBloomEffect(Math.PI / 2, 0.5, 1, 0, false, 0)
    assertEquals(result, 0.5) // No pulse effect
  })

  await test.step('should handle zero base strength', () => {
    const result = calculateBloomEffect(Math.PI / 2, 0, 1, 0.1, false, 0)
    assertAlmostEquals(result, 0.1, 0.001)
  })

  await test.step('should handle negative values', () => {
    const result = calculateBloomEffect(3 * Math.PI / 2, 0.5, 1, 0.2, false, 0)
    assertAlmostEquals(result, 0.3, 0.001)
  })
})
