import { Button } from './Button.tsx'

export interface HeaderProps {
  currentPath?: string
}

/**
 * Vercel-inspired header component with clean navigation
 * Hidden on mobile devices where BottomNav is used instead
 */
export function Header({ currentPath }: HeaderProps) {
  const isActive = (path: string) => currentPath === path

  return (
    <header class='border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 hidden md:block'>
      <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div class='flex justify-between items-center h-16'>
          {/* Logo */}
          <div class='flex items-center'>
            <a
              href='/'
              class='text-xl font-semibold text-black hover:text-gray-700 transition-colors'
            >
              abyssion
            </a>
          </div>

          {/* Navigation */}
          <nav class='flex items-center space-x-1'>
            <a
              href='/shows'
              class={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/shows') ? 'text-black bg-gray-100' : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              Shows
            </a>
            <a
              href='/bio'
              class={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/bio') ? 'text-black bg-gray-100' : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              Bio
            </a>
            <a
              href='/contact'
              class={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/contact') ? 'text-black bg-gray-100' : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
