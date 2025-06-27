type IconProps = { className?: string }

export const MoonIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
    <path
      d='M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z'
      fill='currentColor'
      stroke='currentColor'
      strokeWidth={2}
    />
  </svg>
)
