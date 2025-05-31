import { Head } from '$fresh/runtime.ts'
import Logo3D from '@islands/Home.tsx'
import { BottomNav } from '../components/BottomNav.tsx'
import { getMinLogLevel } from '@lib/logger/utils/getMinLogLevel.ts'

export default function Home() {
  // Get log level on server side where env vars are available
  const logLevel = getMinLogLevel()

  return (
    <>
      <Head>
        <title>abyssion</title>
        <meta name='description' content='Official website for abyssion' />
      </Head>
      <div class='h-screen w-full relative flex flex-col justify-between overflow-hidden bg-black'>
        {/* Floating Header - Hidden on mobile where BottomNav is used */}
        <header class='absolute top-0 left-0 right-0 z-50 hidden md:block'>
          <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div class='flex justify-between items-center h-16'>
              {/* Logo */}
              <div class='flex items-center'>
                <a
                  href='/'
                  class='text-xl font-semibold text-white hover:text-gray-300 transition-colors'
                >
                  abyssion
                </a>
              </div>

              {/* Navigation */}
              <nav class='flex items-center space-x-1'>
                <a
                  href='/shows'
                  class='px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 hover:text-white hover:bg-white/10'
                >
                  Shows
                </a>
                <a
                  href='/bio'
                  class='px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 hover:text-white hover:bg-white/10'
                >
                  Bio
                </a>
                <a
                  href='/contact'
                  class='px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 hover:text-white hover:bg-white/10'
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Logo Container with Social Links Overlay */}
        <div class='flex-1 flex items-center justify-center'>
          <div class='w-full h-full relative flex items-center justify-center'>
            <Logo3D width={1400} height={896} logLevel={logLevel} />

            {/* Social Links - positioned absolutely over the logo */}
            <div class='absolute bottom-8 left-0 right-0'>
              <div class='max-w-md mx-auto flex justify-between px-8'>
                <a href='https://facebook.com' class='text-2xl text-white hover:text-gray-400 transition-colors'>
                  <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' />
                  </svg>
                </a>
                <a href='https://instagram.com' class='text-2xl text-white hover:text-gray-400 transition-colors'>
                  <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z' />
                  </svg>
                </a>

                <a href='https://discord.gg' class='text-2xl text-white hover:text-gray-400 transition-colors'>
                  <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z' />
                  </svg>
                </a>
                <a href='https://soundcloud.com' class='text-2xl text-white hover:text-gray-400 transition-colors'>
                  <svg class='w-8 h-8' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M12 1c6.083 0 11 4.917 11 11s-4.917 11-11 11S1 18.083 1 12 5.917 1 12 1zm-3.5 14.5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1-1.5a.5.5 0 00.5-.5v-2a.5.5 0 00-1 0v2a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v3a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1 0a.5.5 0 00.5-.5v-5a.5.5 0 00-1 0v5a.5.5 0 00.5.5zm1-.5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v3a.5.5 0 00.5.5z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <BottomNav currentPath='/' />
      </div>
    </>
  )
}
