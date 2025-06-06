import { lc, log } from '../../logger/index.ts'

type TextureLoadingResult = {
  stencilTexture: any
  outlineTexture: any
}

/**
 * Loads and configures stencil and outline textures
 */
export const setupTextureLoading = async (
  THREE: typeof import('three'),
  stencilTexturePath: string,
  outlineTexturePath: string,
): Promise<TextureLoadingResult> => {
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setCrossOrigin('anonymous')

  // Load stencil texture with proper error handling
  const stencilTexture = await new Promise((resolve, reject) => {
    textureLoader.load(
      stencilTexturePath,
      (texture: any) => {
        log(lc.GL, 'Stencil texture loaded successfully')
        resolve(texture)
      },
      undefined,
      (error: any) => {
        log.error(lc.GL, 'Error loading stencil texture:', error)
        reject(error)
      },
    )
  })

  // Load outline texture with proper error handling
  const outlineTexture = await new Promise((resolve, reject) => {
    textureLoader.load(
      outlineTexturePath,
      (texture: any) => {
        log(lc.GL, 'Outline texture loaded successfully')
        resolve(texture)
      },
      undefined,
      (error: any) => {
        log.error(lc.GL, 'Error loading outline texture:', error)
        reject(error)
      },
    )
  }) // Ensure textures don't repeat
  ;(stencilTexture as any).wrapS = THREE.ClampToEdgeWrapping
  ;(stencilTexture as any).wrapT = THREE.ClampToEdgeWrapping
  ;(outlineTexture as any).wrapS = THREE.ClampToEdgeWrapping
  ;(outlineTexture as any).wrapT = THREE.ClampToEdgeWrapping

  return { stencilTexture, outlineTexture }
}
