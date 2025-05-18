import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { initLogo3D, type InitOptions } from '../lib/logo3d/index.ts'

interface Logo3DProps {
  width?: number
  height?: number
}

/**
 * 3D logo component with electrical effects and interactivity
 *
 * A shell component that delegates rendering to the Logo3D renderer module
 */
export default function Logo3D({ width = 500, height = 500 }: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize with configuration
    const options: InitOptions = {
      width,
      height,
      outlineTexturePath: '/images/abyssion_logo_outline.png',
      stencilTexturePath: '/images/abyssion_logo_stencil.png',
      container: containerRef.current,
    }

    // Call renderer init and store cleanup function
    const cleanup = initLogo3D(options)

    // Return cleanup function to handle unmounting
    return cleanup
  }, [width, height])

  return (
    <div
      ref={containerRef}
      class='w-full h-full flex items-center justify-center bg-black'
      style={{ width: '100%', height: '100%', minHeight: `${height}px`, position: 'absolute', top: 0, left: 0 }}
    />
  )
}
