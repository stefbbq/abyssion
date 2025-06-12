import * as Three from 'three'
import { lc, log } from '@lib/logger/index.ts'

type TextureLoadingResult = {
  stencilTexture: Three.Texture
  outlineTexture: Three.Texture
}

/**
 * Loads and configures stencil and outline textures
 */
export const setupTextureLoading = async (
  THREE: typeof Three,
  stencilTexturePath: string,
  outlineTexturePath: string,
): Promise<TextureLoadingResult> => {
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setCrossOrigin('anonymous')

  // Load stencil texture with proper error handling
  const stencilTexture = await new Promise((resolve, reject) => {
    textureLoader.load(
      stencilTexturePath,
      (texture: Three.Texture) => {
        log(lc.GL, 'Stencil texture loaded successfully')
        resolve(texture)
      },
      undefined,
      (error: Error) => {
        log.error(lc.GL, 'Error loading stencil texture:', error)
        reject(error)
      },
    )
  })

  // Load outline texture with proper error handling
  const outlineTexture = await new Promise((resolve, reject) => {
    textureLoader.load(
      outlineTexturePath,
      (texture: Three.Texture) => {
        log(lc.GL, 'Outline texture loaded successfully')
        resolve(texture)
      },
      undefined,
      (error: Error) => {
        log.error(lc.GL, 'Error loading outline texture:', error)
        reject(error)
      },
    )
  }) //
   // Ensure textures don't repeat
  ;(stencilTexture as Three.Texture).wrapS = THREE.ClampToEdgeWrapping
  ;(stencilTexture as Three.Texture).wrapT = THREE.ClampToEdgeWrapping
  ;(outlineTexture as Three.Texture).wrapS = THREE.ClampToEdgeWrapping
  ;(outlineTexture as Three.Texture).wrapT = THREE.ClampToEdgeWrapping

  return { stencilTexture, outlineTexture }
}
