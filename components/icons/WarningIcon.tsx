type Props = { className?: string }

export const WarningIcon = ({ className }: Props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    class={className || 'w-5 h-5'}
  >
    <path d='M12 9v4' />
    <path d='M12 17h.01' />
    <path d='M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
  </svg>
)
