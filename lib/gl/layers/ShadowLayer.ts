/**
 * @module ShadowLayer
 *
 * Creates an elliptical gradient shadow behind the logo
 */

import type { ShadowLayer } from '../types.ts'

/**
 * create a gradient shadow layer behind the logo
 */
export const createShadowLayer = (THREE: any, logoWidth: number, logoHeight: number): ShadowLayer | null => {
  // Shadow should be slightly wider than the logo
  const shadowWidth = logoWidth * 2.4
  const shadowHeight = logoHeight * .8

  // Create a simple plane geometry for the shadow
  const geometry = new THREE.PlaneGeometry(shadowWidth, shadowHeight)

  // Create custom shader material for gradient shadow
  const material = new THREE.ShaderMaterial({
    uniforms: {
      opacity: { value: .7 }, // much lighter shadow
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float opacity;
      varying vec2 vUv;
      
      void main() {
        // Calculate distance from center (0.5, 0.5)
        vec2 center = vec2(0.5, 0.5);
        float dist = length((vUv - center) * vec2(1.0, 0.5)); // Scale Y to make it more elliptical
        
        // Smaller solid core, sharper fade
        float coreSize = 0.0;
        float fadeStart = .03;
        float fadeEnd = 0.3;
        
        float alpha = 1.0;
        if (dist > coreSize) {
          alpha = smoothstep(fadeEnd, fadeStart, dist) * opacity;
        } else {
          alpha = opacity;
        }
        
        gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  })

  // Create mesh for the shadow
  const shadowMesh = new THREE.Mesh(geometry, material)

  // Position slightly behind the logo to avoid z-fighting
  shadowMesh.position.z = -0.1

  return {
    mesh: shadowMesh,
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
