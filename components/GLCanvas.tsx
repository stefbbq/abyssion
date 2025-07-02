import { useEffect, useRef } from 'preact/hooks'
import { initGL, type InitOptions } from '@lib/gl/index.ts'

/**
 * GLCanvas component with electrical effects and interactivity
 */
export const GLCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize GL environment
    const options: InitOptions = {
      outlineTexturePath: '/images/abyssion_logo_outline.png',
      stencilTexturePath: '/images/abyssion_logo_stencil.png',
      canvas: canvasRef.current,
    }

    let cleanupFunction: (() => void) | undefined

    const initialize = async () => {
      const cleanup = await initGL(options)
      if (typeof cleanup === 'function') cleanupFunction = cleanup
    }

    initialize()

    return () => {
      if (cleanupFunction) cleanupFunction()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      class='fixed inset-0 w-full h-full block bg-black'
      style={{ top: 0, left: 0 }}
    />
  )
}
