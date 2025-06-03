import { useEffect, useState } from 'preact/hooks'
import { DiscordIcon, FacebookIcon, InstagramIcon, SoundCloudIcon } from '../components/icons/index.ts'
import { getUITheme } from '../lib/theme/index.ts'

export interface HeaderProps {
  currentPath?: string
}

/**
 * Vercel-inspired header component with clean navigation
 * Hidden on mobile devices where BottomNav is used instead
 * Uses new theme system for automatic light/dark mode support
 */
export default function Header({ currentPath }: HeaderProps) {
  const theme = getUITheme()
  const isActive = (path: string) => currentPath === path
  const isHomepage = currentPath === '/'

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  // Track keyboard vs mouse usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsUsingKeyboard(true)
      }
    }

    const handleMouseDown = () => {
      setIsUsingKeyboard(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const getNavItemStyle = (path: string) => ({
    backgroundColor: isActive(path)
      ? theme.colors.interactive.ghostActive
      : hoveredItem === path
      ? theme.colors.interactive.ghostHover
      : 'transparent',
    color: theme.colors.text.primary,
  })

  const getFocusClass = () => isUsingKeyboard ? 'focus:outline-none focus:ring-2' : 'focus:outline-none'

  return (
    <header
      class={`z-50 hidden md:block sticky top-0 ${isHomepage ? '' : 'border-b backdrop-blur-md'}`}
      style={{
        backgroundColor: isHomepage ? 'transparent' : theme.glass.background,
        borderColor: isHomepage ? 'transparent' : theme.colors.border.primary,
      }}
    >
      <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div class='flex justify-between items-center h-16'>
          {/* Logo */}
          <div class='flex items-center'>
            <a
              href='/'
              class={`text-xl font-semibold transition-colors ${getFocusClass()}`}
              style={{
                color: theme.colors.text.primary,
                '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
                class={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${getFocusClass()}`}
                style={{
                  ...getNavItemStyle('/shows'),
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={() => setHoveredItem('/shows')}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem('/shows')}
                onBlur={() => setHoveredItem(null)}
              >
                Shows
              </a>
              <a
                href='/bio'
                class={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${getFocusClass()}`}
                style={{
                  ...getNavItemStyle('/bio'),
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={() => setHoveredItem('/bio')}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem('/bio')}
                onBlur={() => setHoveredItem(null)}
              >
                Bio
              </a>
              <a
                href='/contact'
                class={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${getFocusClass()}`}
                style={{
                  ...getNavItemStyle('/contact'),
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={() => setHoveredItem('/contact')}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem('/contact')}
                onBlur={() => setHoveredItem(null)}
              >
                Contact
              </a>
            </nav>

            {/* Social Icons */}
            <div class='flex items-center space-x-3'>
              <a
                href='https://facebook.com'
                class={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                style={{
                  color: theme.colors.text.secondary,
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
              >
                <FacebookIcon className='w-5 h-5' />
              </a>
              <a
                href='https://instagram.com'
                class={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                style={{
                  color: theme.colors.text.secondary,
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
              >
                <InstagramIcon className='w-5 h-5' />
              </a>
              <a
                href='https://discord.gg'
                class={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                style={{
                  color: theme.colors.text.secondary,
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
              >
                <DiscordIcon className='w-5 h-5' />
              </a>
              <a
                href='https://soundcloud.com'
                class={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                style={{
                  color: theme.colors.text.secondary,
                  '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
              >
                <SoundCloudIcon className='w-5 h-5' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
