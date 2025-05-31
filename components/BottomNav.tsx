import { getUITheme } from '../lib/theme/index.ts'

export interface BottomNavProps {
  currentPath?: string
}

/**
 * Mobile-only dark action bar with full-size buttons
 * Uses Vercel-inspired glass morphism design
 */
export function BottomNav({ currentPath }: BottomNavProps) {
  const theme = getUITheme()
  const isActive = (path: string) => currentPath === path

  const actionBarStyle = {
    background: theme.glass.background,
    backdropFilter: theme.glass.backdrop,
    WebkitBackdropFilter: theme.glass.backdrop,
    borderTop: `1px solid ${theme.glass.border}`,
  }

  return (
    <>
      <style>
        {`
        .action-button:hover:not(.active) {
          background-color: ${theme.colors.interactive.ghostHover} !important;
        }
      `}
      </style>

      <nav
        class='fixed bottom-0 left-0 right-0 z-50 md:hidden'
        style={actionBarStyle}
      >
        <div class='max-w-md mx-auto px-4'>
          <div class='flex items-center gap-3 h-16'>
            {/* Shows Button */}
            <button
              onClick={() => window.location.href = '/shows'}
              class={`action-button flex-1 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                isActive('/shows') ? 'active text-white' : 'text-gray-300 hover:text-white active:scale-95'
              }`}
              style={{
                backgroundColor: isActive('/shows') ? theme.colors.interactive.secondary : theme.colors.interactive.ghost,
              }}
            >
              Shows
            </button>

            {/* Bio Button */}
            <button
              onClick={() => window.location.href = '/bio'}
              class={`action-button flex-1 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                isActive('/bio') ? 'active text-white' : 'text-gray-300 hover:text-white active:scale-95'
              }`}
              style={{
                backgroundColor: isActive('/bio') ? theme.colors.interactive.secondary : theme.colors.interactive.ghost,
              }}
            >
              Bio
            </button>

            {/* Contact Icon */}
            <button
              onClick={() => window.location.href = '/contact'}
              class={`action-button w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isActive('/contact') ? 'active text-white' : 'text-gray-300 hover:text-white active:scale-95'
              }`}
              style={{
                backgroundColor: isActive('/contact') ? theme.colors.interactive.secondary : theme.colors.interactive.ghost,
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
          </div>
        </div>
      </nav>
    </>
  )
}
