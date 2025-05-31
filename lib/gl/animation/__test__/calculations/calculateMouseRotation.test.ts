/// <reference lib="deno.ns" />
import { assertEquals } from '$std/assert/mod.ts'
import { calculateMouseRotation } from '../../calculations/calculateMouseRotation.ts'

Deno.test('calculateMouseRotation - basic functionality', async (test) => {
  await test.step('should calculate rotation from mouse position', () => {
    const result = calculateMouseRotation(0.5, 0.3, 2.0)

    assertEquals(result.targetRotationX, 0.6) // 0.3 * 2.0
    assertEquals(result.targetRotationY, 1.0) // 0.5 * 2.0
  })

  await test.step('should handle zero mouse position', () => {
    const result = calculateMouseRotation(0, 0, 1.5)

    assertEquals(result.targetRotationX, 0)
    assertEquals(result.targetRotationY, 0)
  })

  await test.step('should handle negative mouse positions', () => {
    const result = calculateMouseRotation(-0.5, -0.3, 2.0)

    assertEquals(result.targetRotationX, -0.6) // -0.3 * 2.0
    assertEquals(result.targetRotationY, -1.0) // -0.5 * 2.0
  })
})

Deno.test('calculateMouseRotation - coefficient effects', async (test) => {
  await test.step('should scale with coefficient', () => {
    const mouseX = 0.4
    const mouseY = 0.6

    const result1 = calculateMouseRotation(mouseX, mouseY, 1.0)
    const result2 = calculateMouseRotation(mouseX, mouseY, 2.0)

    assertEquals(result1.targetRotationX, 0.6)
    assertEquals(result1.targetRotationY, 0.4)
    assertEquals(result2.targetRotationX, 1.2) // 2x the first result
    assertEquals(result2.targetRotationY, 0.8) // 2x the first result
  })

  await test.step('should handle zero coefficient', () => {
    const result = calculateMouseRotation(0.5, 0.3, 0)

    assertEquals(result.targetRotationX, 0)
    assertEquals(result.targetRotationY, 0)
  })

  await test.step('should handle fractional coefficient', () => {
    const result = calculateMouseRotation(1.0, 1.0, 0.5)

    assertEquals(result.targetRotationX, 0.5)
    assertEquals(result.targetRotationY, 0.5)
  })
})

Deno.test('calculateMouseRotation - edge cases', async (test) => {
  await test.step('should handle extreme values', () => {
    const result = calculateMouseRotation(1000, -1000, 0.001)

    assertEquals(result.targetRotationX, -1.0) // -1000 * 0.001
    assertEquals(result.targetRotationY, 1.0) // 1000 * 0.001
  })

  await test.step('should maintain precision with small values', () => {
    const result = calculateMouseRotation(0.001, 0.002, 1000)

    assertEquals(result.targetRotationX, 2.0) // 0.002 * 1000
    assertEquals(result.targetRotationY, 1.0) // 0.001 * 1000
  })
})
