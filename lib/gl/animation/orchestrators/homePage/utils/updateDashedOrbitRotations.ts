import * as Three from 'three'

/**
 * updates dashed orbit group rotations based on stored userData
 */
export const updateDashedOrbitRotations = (scene: Three.Scene) => {
  scene.traverse((child: Three.Object3D) => {
    if (child.type !== 'Group') return

    if (!child.children) return

    child.children.forEach((orbitHolder: Three.Object3D) => {
      const hasRotationData = !!(orbitHolder.userData && orbitHolder.userData.rotationSpeed)
      if (!hasRotationData) return

      const { rotationSpeed, rotationAxis } = orbitHolder.userData as { rotationSpeed: number; rotationAxis: 'x' | 'y' | 'z' }

      if (rotationAxis === 'x') orbitHolder.rotation.x += rotationSpeed
      else if (rotationAxis === 'y') orbitHolder.rotation.y += rotationSpeed
      else if (rotationAxis === 'z') orbitHolder.rotation.z += rotationSpeed
    })
  })
}
