/**
 * Generates a random color with optional hue constraints for logo layers
 *
 * @param THREE - The THREE.js library instance
 * @param baseColor - Either an RGBColor object from the theme or a minimum hue value (0-1)
 * @param maxValue - When baseColor is a number, this is the maximum hue; when baseColor is an RGB object, this is the saturation modifier
 * @returns A THREE.Color with random HSL values optimized for glowing effects
 *
 * @remarks
 * This function creates vibrant colors suitable for techno-futuristic logo designs.
 * It uses high saturation (0.7-1.0) and variable lightness (0.6-0.9) for a glowing effect.
 */
import type { RGBColor } from '../../theme.ts'

// Type for HSL object
type HSL = {
  h: number
  s: number
  l: number
}

export const getRandomColor = (
  THREE: typeof import('three'),
  baseColor: RGBColor | number = 0,
  maxValue: number = 1,
) => {
  if (typeof baseColor === 'number') {
    // Original behavior with hue min/max
    const hueMin = baseColor
    const hueMax = maxValue

    // Random hue in the specified range (0-1)
    const h = hueMin + Math.random() * (hueMax - hueMin)
    // High saturation for electric feel (0.7-1.0)
    const s = 0.7 + Math.random() * 0.3
    // Variable lightness (0.6-0.9) for glow effect
    const l = 0.6 + Math.random() * 0.3

    // Convert HSL to RGB
    return new THREE.Color().setHSL(h, s, l)
  } else {
    // New behavior: use the baseColor RGB and apply small variations
    const color = new THREE.Color(baseColor.r, baseColor.g, baseColor.b)

    // Convert to HSL to apply more controlled variations
    const hsl = { h: 0, s: 0, l: 0 } as HSL
    color.getHSL(hsl)

    // Apply small variations while keeping the core theme color
    const saturationVariation = maxValue || 0.3 // Saturation variation is controlled by second param

    // Modify saturation and lightness slightly
    const s = Math.min(1, hsl.s + (Math.random() * saturationVariation * 2 - saturationVariation))
    const l = 0.5 + Math.random() * 0.4 // Keep it bright

    // Apply variations but keep the same base hue
    return new THREE.Color().setHSL(hsl.h, s, l)
  }
}
