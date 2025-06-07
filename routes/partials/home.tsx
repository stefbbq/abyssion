import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import GL from '@components/gl/GLCanvas.tsx'

// disable app wrapper and layouts for partial routes
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  return (
    <>
      <Head>
        <title>abyssion</title>
        <meta name='description' content='Official website for abyssion' />
      </Head>
      <div class='fixed inset-0 bg-black flex items-center justify-center z-0'>
        <div class='w-full h-full relative flex items-center justify-center'>
          <GL width={1400} height={896} />
        </div>
      </div>
    </>
  )
})
