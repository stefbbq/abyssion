import { useEffect, useRef } from 'preact/hooks'
import type { CSSProperties } from 'preact/compat'
import { initGL, type InitOptions } from '@lib/gl/index.ts'

/**
 * GLCanvas component with electrical effects and interactivity
 * Only renders if GL is not disabled (debug signal)
 * Accepts a style prop for parallax transform.
 */
export const GLCanvas = ({ style }: { style?: CSSProperties }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize GL environment
    const options: InitOptions = {
      outlineTexturePath: '/media/images/abyssion_logo_outline-transparent.png',
      stencilTexturePath: '/media/images/abyssion_logo_stencil-transparent.png',
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
      class='fixed inset-0 w-full h-full block -z-30'
      style={style}
    />
  )
}
