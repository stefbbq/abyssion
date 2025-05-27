import * as THREE from 'three'

export type BufferObject = {
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  geometry: THREE.PlaneGeometry
  _plannedStartTime?: number
  _plannedDuration?: number
  _plannedVideoIndex?: number
  _playStartTime?: number // timestamp (ms) when play() resolved for preroll tracking
}
