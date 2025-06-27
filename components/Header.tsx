import { useEffect, useState } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import navData from '@data/nav.json' with { type: 'json' }
// import ThemeToggle from '@molecules/ThemeToggle.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@components/icons/index.ts'
import { useClientLocation } from '@lib/utils/clientLocation.ts'

type SocialIconKey = keyof SocialIconMap

/**
 * Vercel-inspired header component with clean navigation
 * Hidden on mobile devices where BottomNav is used instead
 * Uses new theme system for automatic light/dark mode support
 */
export default function Header() {
  const [currentPath] = useClientLocation()
  const theme = getTheme()
  const isActive = (path: string) => currentPath === path
  const isHomepage = currentPath === '/'

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  console.log('currentPath', currentPath)

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

  const getNavItemStyle = (path: string) => {
    let backgroundColor
    if (isActive(path)) backgroundColor = theme.colors.interactive.ghostActive
    else if (hoveredItem === path) backgroundColor = theme.colors.interactive.ghostHover
    else backgroundColor = 'transparent'

    return {
      backgroundColor,
      color: theme.colors.text.primary,
    }
  }

  const getFocusClass = () => isUsingKeyboard ? 'focus:outline-none focus:ring-2' : 'focus:outline-none'

  return (
    <header
      class={`top-0 left-0 right-0 z-50 hidden md:block sticky ${isHomepage ? '' : 'border-b backdrop-blur-md'}`}
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
              {navData.mainNav
                .filter((item) => !item.excludeFrom?.includes('header'))
                .map((item) => (
                  <a
                    key={item.key}
                    href={item.path}
                    class={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${getFocusClass()}`}
                    style={{
                      ...getNavItemStyle(item.path),
                      '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onFocus={() => setHoveredItem(item.path)}
                    onBlur={() => setHoveredItem(null)}
                  >
                    {item.label}
                  </a>
                ))}
            </nav>

            {/* Social Icons */}
            <div class='flex items-center space-x-3'>
              {(navData.socialLinks as Array<{ key: string; url: string; label: string; icon: SocialIconKey }>)
                .map((social) => {
                  const IconComponent = SocialIcons[social.icon]

                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      aria-label={social.label}
                      class={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                      style={{
                        color: theme.colors.text.secondary,
                        '--tw-ring-color': isUsingKeyboard ? theme.colors.interactive.primary : 'transparent',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
                    >
                      {IconComponent ? <IconComponent className='w-5 h-5 opacity-50' /> : <div class='w-5 h-5 bg-current opacity-50'></div>}
                    </a>
                  )
                })}
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
