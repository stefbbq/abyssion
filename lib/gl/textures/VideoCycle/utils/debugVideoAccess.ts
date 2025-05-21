/**
 * Debug server access to videos
 * Tests if videos can be accessed from the server
 */
export const debugVideoAccess = async (): Promise<string | null> => {
  console.log('Debugging video access...')
  console.log('[VideoBackground] Skipping legacy test paths. Will use manifest-based video loading only.')
  console.log('Testing static file access with favicon.ico as a general static file check...')

  // Try to load an image from various paths to test general static file access
  const img = new Image()
  const testImage = (): Promise<boolean> => {
    return new Promise((resolve) => {
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      // Unique timestamp to bypass cache
      img.src = `/static/favicon.ico?t=${Date.now()}`
    })
  }

  const imageLoaded = await testImage()
  console.log(`Static favicon.ico load test: ${imageLoaded ? '✅' : '❌'}`)

  return null // Couldn't find a working path
}
