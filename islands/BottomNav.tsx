import { useEffect, useRef, useState } from 'preact/hooks'
import { DiscordIcon, FacebookIcon, HamburgerIcon, InstagramIcon, SoundCloudIcon } from '../components/icons/index.ts'
import { getUITheme } from '../lib/theme/index.ts'

export interface BottomNavProps {
  currentPath?: string
}

/**
 * Mobile-only dark bottom navigation with Vercel-style outlined buttons
 * Features expandable full menu with drag functionality and snap behavior
 */
export default function BottomNav({ currentPath }: BottomNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(0)
  const navRef = useRef<HTMLElement>(null)

  const theme = getUITheme()
  const isActive = (path: string) => currentPath === path

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Shows', path: '/shows' },
    { label: 'Bio', path: '/bio' },
    { label: 'Newsletter', path: '#newsletter' },
    { label: 'Contact', path: '/contact' },
    { label: 'Listen', path: '#listen' },
  ]

  const EXPANDED_HEIGHT = 400 // Fixed height for consistency
  const COLLAPSED_HEIGHT = 64

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setDragY(0)
  }

  // Simple touch handlers with corrected direction
  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setDragY(0)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return

    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY // Fixed: currentY - startY (not startY - currentY)

    if (isMenuOpen) {
      // Dragging down to close (positive deltaY closes)
      const newDragY = Math.max(-EXPANDED_HEIGHT + COLLAPSED_HEIGHT, deltaY)
      setDragY(newDragY)
    } else {
      // Dragging up to open (negative deltaY opens)
      const newDragY = Math.min(0, deltaY)
      setDragY(newDragY)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const threshold = (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) / 3

    if (isMenuOpen) {
      // If dragged down more than threshold, close it
      if (dragY > threshold) {
        setIsMenuOpen(false)
      }
    } else {
      // If dragged up more than threshold, open it
      if (dragY < -threshold) {
        setIsMenuOpen(true)
      }
    }

    setIsDragging(false)
    setDragY(0)
  }

  // Mouse handlers for desktop testing with corrected direction
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true)
    setStartY(e.clientY)
    setDragY(0)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const currentY = e.clientY
    const deltaY = currentY - startY // Fixed: currentY - startY

    if (isMenuOpen) {
      const newDragY = Math.max(-EXPANDED_HEIGHT + COLLAPSED_HEIGHT, deltaY)
      setDragY(newDragY)
    } else {
      const newDragY = Math.min(0, deltaY)
      setDragY(newDragY)
    }
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    const threshold = (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) / 3

    if (isMenuOpen) {
      if (dragY > threshold) {
        setIsMenuOpen(false)
      }
    } else {
      if (dragY < -threshold) {
        setIsMenuOpen(true)
      }
    }

    setIsDragging(false)
    setDragY(0)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isMenuOpen, startY, dragY])

  const getCurrentHeight = () => {
    if (isDragging) {
      if (isMenuOpen) {
        // When open: dragging down (positive dragY) should decrease height
        return Math.max(COLLAPSED_HEIGHT, EXPANDED_HEIGHT - dragY)
      } else {
        // When closed: dragging up (negative dragY) should increase height
        return Math.min(EXPANDED_HEIGHT, COLLAPSED_HEIGHT - dragY)
      }
    }
    return isMenuOpen ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
  }

  const showExpandedContent = isMenuOpen || (isDragging && dragY < -50)

  // Create transparent background style
  const backgroundStyle = {
    background: theme.glass.background,
    backdropFilter: theme.glass.backdrop,
    WebkitBackdropFilter: theme.glass.backdrop,
    borderTop: `1px solid ${theme.glass.border}`,
  }

  return (
    <>
      {/* Overlay */}
      {showExpandedContent && (
        <div
          class='fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Bottom Navigation Container */}
      <nav
        ref={navRef}
        class={`fixed bottom-0 left-0 right-0 z-50 md:hidden overflow-hidden ${isDragging ? '' : 'transition-all duration-300 ease-out'} ${
          showExpandedContent ? 'rounded-t-2xl' : ''
        }`}
        style={{
          height: `${getCurrentHeight()}px`,
          ...backgroundStyle,
        }}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Tab */}
        {showExpandedContent && (
          <div class='flex justify-center pt-3 pb-2'>
            <div
              class='w-12 h-1 rounded-full'
              style={{ backgroundColor: theme.colors.text.tertiary }}
            >
            </div>
          </div>
        )}

        <div class='max-w-md mx-auto h-full'>
          {/* Expanded Menu Content */}
          {showExpandedContent
            ? (
              <div class='px-6 pb-6 space-y-6'>
                {/* Social Links Row */}
                <div class='flex items-center justify-center space-x-8 pt-2'>
                  <a
                    href='https://facebook.com'
                    class='transition-colors'
                    style={{
                      color: theme.colors.text.secondary,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
                  >
                    <FacebookIcon className='w-6 h-6' />
                  </a>
                  <a
                    href='https://instagram.com'
                    class='transition-colors'
                    style={{
                      color: theme.colors.text.secondary,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
                  >
                    <InstagramIcon className='w-6 h-6' />
                  </a>
                  <a
                    href='https://discord.gg'
                    class='transition-colors'
                    style={{
                      color: theme.colors.text.secondary,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
                  >
                    <DiscordIcon className='w-6 h-6' />
                  </a>
                  <a
                    href='https://soundcloud.com'
                    class='transition-colors'
                    style={{
                      color: theme.colors.text.secondary,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
                  >
                    <SoundCloudIcon className='w-6 h-6' />
                  </a>
                </div>

                {/* Menu Items */}
                <div class='space-y-1'>
                  {menuItems.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      class='block w-full text-center py-4 font-medium transition-colors rounded-lg'
                      style={{
                        backgroundColor: isActive(item.path) ? theme.colors.text.primary : 'transparent',
                        color: isActive(item.path) ? theme.colors.background.primary : theme.colors.text.secondary,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.backgroundColor = theme.colors.interactive.ghostHover
                          e.currentTarget.style.color = theme.colors.text.primary
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.path)) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = theme.colors.text.secondary
                        }
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )
            : (
              /* Collapsed Navigation */
              <div class='px-4 h-full'>
                <div class='flex items-center gap-3 h-16'>
                  {/* Shows Button */}
                  <button
                    onClick={() => window.location.href = '/shows'}
                    class='flex-1 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 border'
                    style={{
                      backgroundColor: isActive('/shows') ? theme.colors.text.primary : 'transparent',
                      color: isActive('/shows') ? theme.colors.background.primary : theme.colors.text.secondary,
                      borderColor: isActive('/shows') ? theme.colors.text.primary : theme.colors.border.primary,
                    }}
                  >
                    Shows
                  </button>

                  {/* Bio Button */}
                  <button
                    onClick={() => window.location.href = '/bio'}
                    class='flex-1 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 border'
                    style={{
                      backgroundColor: isActive('/bio') ? theme.colors.text.primary : 'transparent',
                      color: isActive('/bio') ? theme.colors.background.primary : theme.colors.text.secondary,
                      borderColor: isActive('/bio') ? theme.colors.text.primary : theme.colors.border.primary,
                    }}
                  >
                    Bio
                  </button>

                  {/* Contact Icon */}
                  <button
                    onClick={() => window.location.href = '/contact'}
                    class='w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 border'
                    style={{
                      backgroundColor: isActive('/contact') ? theme.colors.text.primary : 'transparent',
                      color: isActive('/contact') ? theme.colors.background.primary : theme.colors.text.secondary,
                      borderColor: isActive('/contact') ? theme.colors.text.primary : theme.colors.border.primary,
                    }}
                  >
                    <svg
                      class='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </button>

                  {/* Hamburger Icon */}
                  <button
                    onClick={toggleMenu}
                    class='w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 border'
                    style={{
                      backgroundColor: isMenuOpen ? theme.colors.text.primary : 'transparent',
                      color: isMenuOpen ? theme.colors.background.primary : theme.colors.text.secondary,
                      borderColor: isMenuOpen ? theme.colors.text.primary : theme.colors.border.primary,
                    }}
                  >
                    <HamburgerIcon className='w-5 h-5' />
                  </button>
                </div>
              </div>
            )}
        </div>
      </nav>
    </>
  )
}
