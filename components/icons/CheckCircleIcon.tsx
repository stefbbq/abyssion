type Props = { className?: string }

export const CheckCircleIcon = ({ className }: Props) => (
  <svg class={className || 'w-6 h-6'} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.03 6.22a.75.75 0 0 1 0 1.06l-5.3 5.3a.75.75 0 0 1-1.06 0l-2.12-2.12a.75.75 0 1 1 1.06-1.06l1.59 1.59 4.77-4.77a.75.75 0 0 1 1.06 0z' />
  </svg>
)

export default CheckCircleIcon
