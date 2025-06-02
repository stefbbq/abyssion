import { Button } from './Button.tsx'
import { DiscordIcon, FacebookIcon, InstagramIcon, SoundCloudIcon } from './icons/index.ts'

export interface HeaderProps {
  currentPath?: string
  theme?: 'light' | 'dark'
}

/**
 * Vercel-inspired header component with clean navigation
 * Hidden on mobile devices where BottomNav is used instead
 */
export function Header({ currentPath, theme = 'light' }: HeaderProps) {
  const isActive = (path: string) => currentPath === path

  const isDark = theme === 'dark'

  // theme-dependent styles
  const headerStyles = isDark ? 'bg-transparent' : 'border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0'

  const logoStyles = isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'

  const navLinkStyles = (isCurrentPath: boolean) =>
    isDark
      ? isCurrentPath ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
      : isCurrentPath
      ? 'text-black bg-gray-100'
      : 'text-gray-600 hover:text-black hover:bg-gray-50'

  const dividerStyles = isDark ? 'bg-gray-500' : 'bg-gray-300'
  const socialIconStyles = isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'

  return (
    <header class={`z-50 hidden md:block ${headerStyles}`}>
      <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div class='flex justify-between items-center h-16'>
          {/* Logo */}
          <div class='flex items-center'>
            <a
              href='/'
              class={`text-xl font-semibold transition-colors ${logoStyles}`}
            >
              abyssion
            </a>
          </div>

          {/* Navigation and Social Icons */}
          <div class='flex items-center space-x-4'>
            {/* Main Navigation */}
            <nav class='flex items-center space-x-1'>
              <a
                href='/shows'
                class={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${navLinkStyles(isActive('/shows'))}`}
              >
                Shows
              </a>
              <a
                href='/bio'
                class={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${navLinkStyles(isActive('/bio'))}`}
              >
                Bio
              </a>
              <a
                href='/contact'
                class={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${navLinkStyles(isActive('/contact'))}`}
              >
                Contact
              </a>
            </nav>

            {/* Social Icons */}
            <div class='flex items-center space-x-3'>
              <a href='https://facebook.com' class={`transition-colors ${socialIconStyles}`}>
                <FacebookIcon className='w-5 h-5' />
              </a>
              <a href='https://instagram.com' class={`transition-colors ${socialIconStyles}`}>
                <InstagramIcon className='w-5 h-5' />
              </a>
              <a href='https://discord.gg' class={`transition-colors ${socialIconStyles}`}>
                <DiscordIcon className='w-5 h-5' />
              </a>
              <a href='https://soundcloud.com' class={`transition-colors ${socialIconStyles}`}>
                <SoundCloudIcon className='w-5 h-5' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
