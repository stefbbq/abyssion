/**
 * Create a simple placeholder geometry
 * This will be replaced with a proper 3D model later
 */
export const createExtrudedGeometry = (THREE: any, texture: any, width: number, height: number) => {
  // Just return a simple flat plane geometry
  // The actual 3D model will be added later
  return new THREE.PlaneGeometry(width, height)
}
