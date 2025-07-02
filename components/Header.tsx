import { useEffect, useState } from 'preact/hooks'
import navData from '@data/nav.json' with { type: 'json' }
import { ThemeToggle } from '@components/ThemeToggle.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@components/icons/index.ts'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { HeaderLink } from './HeaderLink.tsx'

type SocialIconKey = keyof SocialIconMap

/**
 * Desktop navigation bar for the app, styled with utility classes and CSS variables.
 * Responsive, sticky, and theme-aware. Includes logo, navigation links, social icons, and theme toggle.
 * Uses navData for navigation structure and adapts to scroll/keyboard state.
 *
 * @example
 *   <Header />
 */
export const Header = () => {
  const [currentPath] = useClientLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setIsScrolled(globalThis.scrollY > 20)
    globalThis.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check on initial load
    return () => globalThis.removeEventListener('scroll', handleScroll)
  }, [])

  // Track keyboard vs mouse usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Tab' && setIsUsingKeyboard(true)
    const handleMouseDown = () => setIsUsingKeyboard(false)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // dynamic classes
  const getFocusClass = () => isUsingKeyboard ? 'focus:outline-none focus:ring-2' : 'focus:outline-none'
  const headerClasses = isScrolled ? 'mx-4' : 'mx-2'
  const containerClasses = isScrolled ? 'frost-effect shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]' : 'bg-transparent shadow-none'

  return (
    <header class={`top-2 z-50 hidden md:block sticky transition-all duration-300 py-2 ${headerClasses}`}>
      <div
        id='header-container'
        class={`max-w-7xl mx-auto flex justify-between items-center h-16 transition-all duration-300 rounded-full px-4 ${containerClasses}`}
      >
        {/* Logo */}
        <h1 class='flex items-center m-0'>
          <HeaderLink
            href='/'
            className={`text-xl font-semibold ${getFocusClass()}`}
            ariaLabel='Abyssion home'
          >
            abyssion
          </HeaderLink>
        </h1>

        {/* Navigation */}
        <nav class='flex items-center space-x-1'>
          {/* Pages */}
          <div class='flex items-center'>
            {navData.mainNav
              .filter((item) => !item.excludeFrom?.includes('header'))
              .map((item) => (
                <HeaderLink
                  key={item.key}
                  href={item.path}
                  className={getFocusClass()}
                  isActive={item.path === currentPath}
                >
                  {item.label}
                </HeaderLink>
              ))}
          </div>

          {/* Social Icons & theme toggle */}
          <div class='flex items-center'>
            {(navData.socialLinks as Array<{ key: string; url: string; label: string; icon: SocialIconKey }>)
              .map((item) => {
                const IconComponent = SocialIcons[item.icon]
                return (
                  <HeaderLink
                    key={item.key}
                    href={item.url}
                    ariaLabel={item.label}
                    className={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                    compact
                  >
                    {IconComponent ? <IconComponent className='w-5 h-5' /> : <div class='w-5 h-5 bg-current' />}
                  </HeaderLink>
                )
              })}
            <span class='ml-2'>
              <ThemeToggle />
            </span>
          </div>
        </nav>
      </div>
    </header>
  )
}
