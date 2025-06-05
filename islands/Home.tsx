import { useEffect, useRef } from 'preact/hooks'
import { initGL, type InitOptions } from '@libgl/index.ts'
import { initializeLoggerClient } from '@lib/logger/utils/initializeLoggerClient.ts'
import { LogLevel } from '@lib/logger/constants.ts'

type Props = {
  width?: number
  height?: number
  logLevel?: LogLevel
}

/**
 * GL component with electrical effects and interactivity
 */
export default function GL({ width = 500, height = 500 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize client-side logger (theme colors)
    initializeLoggerClient()

    if (!containerRef.current) return

    // Initialize GL environment
    const options: InitOptions = {
      width,
      height,
      outlineTexturePath: '/images/abyssion_logo_outline.png',
      stencilTexturePath: '/images/abyssion_logo_stencil.png',
      container: containerRef.current,
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
  }, [width, height])

  return (
    <div
      ref={containerRef}
      class='w-full h-full flex items-center justify-center bg-black'
      style={{ width: '100%', height: '100%', minHeight: `${height}px`, position: 'absolute', top: 0, left: 0 }}
    />
  )
}
