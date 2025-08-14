import * as Three from 'three'
import type { BloomParams } from '@lib/gl/configPostProcessing.types.ts'

export const createBloomPass = async (
  THREE: typeof Three,
  width: number,
  height: number,
  bloom?: BloomParams,
) => {
  if (!bloom) return null
  const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
  const pass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    (bloom.bloomStrength ?? 0) * (bloom.bloomStrengthMultiplier ?? 1),
    bloom.bloomRadius ?? 0,
    (bloom.bloomThreshold ?? 0) * (bloom.bloomThresholdMultiplier ?? 1),
  )
  if (typeof bloom.thresholdOverride === 'number') pass.threshold = bloom.thresholdOverride
  return pass
}



