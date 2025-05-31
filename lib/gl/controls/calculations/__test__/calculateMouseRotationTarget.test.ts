import { assertEquals } from '$std/assert/mod.ts'
import { calculateMouseRotationTarget } from '../calculateMouseRotationTarget.ts'
import type { MousePosition } from '../../types.ts'

Deno.test('calculateMouseRotationTarget', async (test) => {
  await test.step('should calculate rotation target with positive coefficient', () => {
    const position: MousePosition = { x: 0.5, y: -0.3 }
    const mouseCoefficient = 2.0

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    assertEquals(result, {
      targetRotationX: -0.6, // -0.3 * 2.0
      targetRotationY: 1.0, // 0.5 * 2.0
    })
  })

  await test.step('should calculate rotation target with negative coefficient', () => {
    const position: MousePosition = { x: 0.4, y: 0.6 }
    const mouseCoefficient = -1.5

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    const expectedX = 0.6 * -1.5 // 0.9
    const expectedY = 0.4 * -1.5 // -0.6

    // Use tolerance for floating point precision
    const tolerance = 0.00001
    assertEquals(Math.abs(result.targetRotationX - expectedX) < tolerance, true)
    assertEquals(Math.abs(result.targetRotationY - expectedY) < tolerance, true)
  })

  await test.step('should handle zero coefficient', () => {
    const position: MousePosition = { x: 1.0, y: -1.0 }
    const mouseCoefficient = 0

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    assertEquals(result, {
      targetRotationX: 0, // -1.0 * 0
      targetRotationY: 0, // 1.0 * 0
    })
  })

  await test.step('should handle zero position', () => {
    const position: MousePosition = { x: 0, y: 0 }
    const mouseCoefficient = 3.5

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    assertEquals(result, {
      targetRotationX: 0, // 0 * 3.5
      targetRotationY: 0, // 0 * 3.5
    })
  })

  await test.step('should handle extreme values', () => {
    const position: MousePosition = { x: -1.0, y: 1.0 }
    const mouseCoefficient = 0.1

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    assertEquals(result, {
      targetRotationX: 0.1, // 1.0 * 0.1
      targetRotationY: -0.1, // -1.0 * 0.1
    })
  })

  await test.step('should maintain precision with decimal values', () => {
    const position: MousePosition = { x: 0.123, y: -0.456 }
    const mouseCoefficient = 1.789

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    const expectedX = -0.456 * 1.789
    const expectedY = 0.123 * 1.789

    // Check with tolerance for floating point precision
    assertEquals(Math.abs(result.targetRotationX - expectedX) < 0.00001, true)
    assertEquals(Math.abs(result.targetRotationY - expectedY) < 0.00001, true)
  })

  await test.step('should correctly map x to Y rotation and y to X rotation', () => {
    const position: MousePosition = { x: 1.0, y: 0.0 }
    const mouseCoefficient = 1.0

    const result = calculateMouseRotationTarget(position, mouseCoefficient)

    // Verify the coordinate mapping
    assertEquals(result.targetRotationX, 0.0) // comes from position.y
    assertEquals(result.targetRotationY, 1.0) // comes from position.x
  })
})
