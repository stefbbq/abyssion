import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import { Head } from '$fresh/runtime.ts'
import GL from '../../islands/Home.tsx'
import Header from '../../islands/Header.tsx'

// disable app wrapper and layouts for partial routes
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  return (
    <Partial name='page-content'>
      <Head>
        <title>abyssion</title>
        <meta name='description' content='Official website for abyssion' />
      </Head>
      <div class='h-screen w-full relative flex flex-col justify-between overflow-hidden bg-black'>
        {/* Dark Header for Homepage */}
        <div class='absolute top-0 left-0 right-0 z-50'>
          <Header currentPath='/' />
        </div>

        {/* Logo Container */}
        <div class='flex-1 flex items-center justify-center'>
          <div class='w-full h-full relative flex items-center justify-center'>
            <GL width={1400} height={896} />
          </div>
        </div>
      </div>
    </Partial>
  )
})
