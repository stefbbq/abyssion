import { useEffect } from 'preact/hooks'

export type SnackbarProps = {
  message: string
  variant?: 'info' | 'success' | 'error'
  durationMs?: number
  onClose?: () => void
}

export default function Snackbar({ message, variant = 'info', durationMs = 4000, onClose }: SnackbarProps) {
  useEffect(() => {
    if (!durationMs) return
    const timer = setTimeout(() => onClose && onClose(), durationMs)
    return () => clearTimeout(timer)
  }, [message, durationMs, onClose])

  const variantClasses = variant === 'error'
    ? 'border-red-500 text-red-200'
    : variant === 'success'
    ? 'border-emerald-500 text-emerald-200'
    : 'border-[var(--colors-text-tertiary)] text-[var(--colors-text-primary)]'

  return (
    <div class={`fixed left-1/2 bottom-6 -translate-x-1/2 z-[1000]`} aria-live='polite' aria-atomic='true'>
      <div class={`px-4 py-2 rounded-md shadow-lg bg-[var(--colors-bg-elevated)] border ${variantClasses}`}>{message}</div>
    </div>
  )
}
