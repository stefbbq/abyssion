type IconProps = {
  className?: string
}

export const HamburgerIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
  </svg>
)
