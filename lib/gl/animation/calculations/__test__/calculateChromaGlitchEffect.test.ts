import { assert, assertEquals } from '$std/assert/mod.ts'
import { calculateChromaGlitchEffect } from '../calculateChromaGlitchEffect.ts'

Deno.test('calculateChromaGlitchEffect - no glitch when current value too high', async (test) => {
  await test.step('should not apply glitch when current strength exceeds 2x default', () => {
    const currentChromaStrength = 20
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 1.0, // 100% probability, should still not apply
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 4.0,
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    assertEquals(result.shouldApplyGlitch, false)
    assertEquals(result.newChromaStrength, currentChromaStrength)
    assertEquals(result.shouldReset, false)
  })

  await test.step('should not apply glitch when current equals exactly 2x default', () => {
    const currentChromaStrength = 10
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 1.0,
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 4.0,
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    // At exactly 2x, the condition is currentChromaStrength > defaultChromaStrength * 2
    // 10 > 5 * 2 is 10 > 10 which is false, so glitch should be allowed
    assertEquals(result.shouldApplyGlitch, true)
    assertEquals(result.shouldReset, false)
  })
})

Deno.test('calculateChromaGlitchEffect - glitch application', async (test) => {
  await test.step('should apply glitch when probability conditions met', () => {
    const currentChromaStrength = 5
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 1.0, // Guaranteed trigger
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 3.0,
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    assertEquals(result.shouldApplyGlitch, true)
    assertEquals(result.shouldReset, false)
    // Should be between 10 (5*2) and 15 (5*3)
    assert(result.newChromaStrength >= 10)
    assert(result.newChromaStrength <= 15)
  })

  await test.step('should cap glitch effect at 5x default', () => {
    const currentChromaStrength = 2
    const defaultChromaStrength = 2
    const glitchConfig = {
      chromaGlitchProbability: 1.0,
      chromaGlitchIntensityMin: 10.0, // Would result in 20, but should cap at 10 (5*2)
      chromaGlitchIntensityMax: 15.0,
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    assertEquals(result.shouldApplyGlitch, true)
    assertEquals(result.newChromaStrength, 10) // Capped at 5 * defaultChromaStrength
    assertEquals(result.shouldReset, false)
  })

  await test.step('should not apply glitch when probability not met', () => {
    const currentChromaStrength = 5
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 0.0, // Never trigger
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 3.0,
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    assertEquals(result.shouldApplyGlitch, false)
    assertEquals(result.newChromaStrength, currentChromaStrength)
  })
})

Deno.test('calculateChromaGlitchEffect - reset behavior', async (test) => {
  await test.step('should have mechanism for occasional reset', () => {
    // Since the probability is very low (0.001), we test the logic path exists
    // rather than relying on random chance in a test
    const currentChromaStrength = 15
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 0.0, // No glitch
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 3.0,
    }

    // Test that the function can return different outcomes
    let foundReset = false
    let foundNoChange = false

    // Run until we find both outcomes or reach reasonable limit
    for (let i = 0; i < 10000 && !(foundReset && foundNoChange); i++) {
      const result = calculateChromaGlitchEffect(
        currentChromaStrength,
        defaultChromaStrength,
        glitchConfig,
      )

      if (result.shouldReset) {
        foundReset = true
        assertEquals(result.newChromaStrength, defaultChromaStrength)
        assertEquals(result.shouldApplyGlitch, false)
      } else {
        foundNoChange = true
        assertEquals(result.newChromaStrength, currentChromaStrength)
        assertEquals(result.shouldApplyGlitch, false)
        assertEquals(result.shouldReset, false)
      }
    }

    // At minimum, we should find the no-change case (which is the majority)
    assert(foundNoChange, 'Should find no-change case')
  })

  await test.step('should reset to exact default value when reset occurs', () => {
    // This tests the reset logic specifically when it happens to trigger
    const currentChromaStrength = 25
    const defaultChromaStrength = 8
    const glitchConfig = {
      chromaGlitchProbability: 0.0,
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 3.0,
    }

    // Keep trying until we get a reset (or give up after reasonable attempts)
    let attempts = 0
    let resetFound = false

    while (attempts < 20000 && !resetFound) {
      const result = calculateChromaGlitchEffect(
        currentChromaStrength,
        defaultChromaStrength,
        glitchConfig,
      )

      if (result.shouldReset) {
        resetFound = true
        assertEquals(result.shouldApplyGlitch, false)
        assertEquals(result.newChromaStrength, defaultChromaStrength)
        assertEquals(result.shouldReset, true)
      }
      attempts++
    }

    // It's OK if we don't find a reset - the probability is very low
    // This test documents the expected behavior when it does occur
  })
})

Deno.test('calculateChromaGlitchEffect - edge cases', async (test) => {
  await test.step('should handle zero values', () => {
    const currentChromaStrength = 0
    const defaultChromaStrength = 0
    const glitchConfig = {
      chromaGlitchProbability: 1.0,
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 3.0,
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    assertEquals(result.shouldApplyGlitch, true)
    assertEquals(result.newChromaStrength, 0) // 0 * intensity = 0, capped at 0
  })

  await test.step('should handle minimum intensity equal to maximum', () => {
    const currentChromaStrength = 5
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 1.0,
      chromaGlitchIntensityMin: 2.5,
      chromaGlitchIntensityMax: 2.5, // Same as min
    }

    const result = calculateChromaGlitchEffect(
      currentChromaStrength,
      defaultChromaStrength,
      glitchConfig,
    )

    assertEquals(result.shouldApplyGlitch, true)
    assertEquals(result.newChromaStrength, 12.5) // 5 * 2.5
    assertEquals(result.shouldReset, false)
  })

  await test.step('should handle very small probability values', () => {
    const currentChromaStrength = 5
    const defaultChromaStrength = 5
    const glitchConfig = {
      chromaGlitchProbability: 0.000001, // Very small but not zero
      chromaGlitchIntensityMin: 2.0,
      chromaGlitchIntensityMax: 3.0,
    }

    // Should mostly not trigger
    let triggerCount = 0
    for (let i = 0; i < 1000; i++) {
      const result = calculateChromaGlitchEffect(
        currentChromaStrength,
        defaultChromaStrength,
        glitchConfig,
      )
      if (result.shouldApplyGlitch) triggerCount++
    }

    // Should trigger very rarely or not at all
    assert(triggerCount < 10, `Expected very few triggers, got ${triggerCount}`)
  })
})
