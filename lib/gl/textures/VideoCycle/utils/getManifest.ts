import { lc, log } from '@lib/logger/index.ts'

/**
 * Loads the video manifest from the manifest.json file
 *
 * @returns {Promise<readonly string[]>} The video manifest
 */
export const getManifest = async (manifestPath: string): Promise<readonly string[]> => {
  try {
    const response = await fetch(`${manifestPath}manifest.json`)

    if (!response.ok) throw new Error(`Failed to fetch manifest: ${response.status}`)

    const manifestData = await response.json()
    const files = Array.isArray(manifestData) ? manifestData.filter((file) => typeof file === 'string') : []

    return files
  } catch (error) {
    log.error(lc.GL_VIDEO, 'Error loading video manifest:', error)
    return []
  }
}
