/**
 * Position and rotation data for a layer
 */
export type LayerPosition = {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly rotationX: number
  readonly rotationY: number
}

/**
 * Calculate position for a static layer with subtle breathing motion
 */
export const calculateStaticLayerPosition = (
  time: number,
  index: number,
  baseZPos: number,
  isStencil: boolean,
): LayerPosition => {
  const breatheAmount = 0.02

  if (isStencil) {
    return {
      x: 0,
      y: 0,
      z: baseZPos + Math.sin(time * 0.2) * breatheAmount,
      rotationX: Math.sin(time * 0.1) * 0.03,
      rotationY: Math.cos(time * 0.15) * 0.03,
    }
  }

  return {
    x: 0,
    y: 0,
    z: baseZPos + Math.sin(time * 0.2 + index * 0.05) * breatheAmount,
    rotationX: 0,
    rotationY: 0,
  }
}
