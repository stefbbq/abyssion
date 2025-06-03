import { Head } from '$fresh/runtime.ts'
import Logo3D from '@islands/Home.tsx'
import BottomNav from '../islands/BottomNav.tsx'
import Header from '../islands/Header.tsx'
import { getMinLogLevel } from '@lib/logger/utils/getMinLogLevel.ts'

export default function Home() {
  const logLevel = getMinLogLevel()

  return (
    <>
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
            <Logo3D width={1400} height={896} logLevel={logLevel} />
          </div>
        </div>

        <BottomNav currentPath='/' />
      </div>
    </>
  )
}
