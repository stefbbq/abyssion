type IconProps = { className?: string }

export const BackIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
  </svg>
)
