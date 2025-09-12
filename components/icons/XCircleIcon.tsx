type Props = { className?: string }

export const XCircleIcon = ({ className }: Props) => (
  <svg class={className || 'w-6 h-6'} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-3 6.6a.75.75 0 0 1 1.06 0L12 10.49l2.4-2.4a.75.75 0 1 1 1.06 1.06L13.06 11.59l2.4 2.4a.75.75 0 1 1-1.06 1.06L12 12.65l-2.4 2.4a.75.75 0 1 1-1.06-1.06l2.4-2.4-2.4-2.4a.75.75 0 0 1 0-1.06z' />
  </svg>
)
