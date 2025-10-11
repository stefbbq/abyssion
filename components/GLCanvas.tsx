import { useEffect, useRef, useState } from 'preact/hooks'
import type { CSSProperties } from 'preact/compat'

/**
 * GLCanvas component with electrical effects and interactivity
 * Lazy loads GL code after initial render to improve page load performance
 * Only renders if GL is not disabled (debug signal)
 * Accepts a style prop for parallax transform.
 */
export const GLCanvas = ({ style }: { style?: CSSProperties }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || isLoading) return

    setIsLoading(true)

    // defer GL initialization to allow page to render first
    const initializeGL = async () => {
      // wait for page to be interactive before loading heavy GL code
      await new Promise((resolve) => {
        if (document.readyState === 'complete') {
          // page already loaded, wait one frame to allow render
          requestAnimationFrame(resolve)
        } else {
          // wait for page load
          globalThis.addEventListener('load', resolve, { once: true })
        }
      })

      // additional small delay to ensure smooth page interaction
      await new Promise((resolve) => setTimeout(resolve, 100))

      // lazy load GL module (code splits Three.js away from main bundle)
      const { initGL } = await import('@lib/gl/index.ts')

      const options = {
        outlineTexturePath: '/media/images/abyssion_logo_outline-transparent.png',
        stencilTexturePath: '/media/images/abyssion_logo_stencil-transparent.png',
        canvas: canvasRef.current!,
      }

      return await initGL(options)
    }

    let cleanupFunction: (() => void) | undefined

    initializeGL()
      .then((cleanup) => {
        if (typeof cleanup === 'function') cleanupFunction = cleanup
      })
      .catch((error) => {
        console.error('Failed to initialize GL:', error)
      })

    return () => {
      if (cleanupFunction) cleanupFunction()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      class='fixed inset-0 w-full h-full block -z-30'
      style={style}
    />
  )
}
