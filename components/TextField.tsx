import { CheckCircleIcon } from './icons/CheckCircleIcon.tsx'
import { XCircleIcon } from './icons/XCircleIcon.tsx'
type Props = {
  // field label (static top-left)
  label: string
  // field name/ID
  name: string
  // input type (default: 'text')
  type?: string
  // placeholder text
  placeholder?: string
  // whether the field is required
  required?: boolean
  // additional class names
  className?: string
  // if true, renders a <textarea> instead of <input>
  textarea?: boolean
  // number of rows for textarea
  rows?: number
}

/**
 * text field (server-safe)
 * stateless input/textarea with a static floating-style label and theme-aware focus ring with offset.
 */
export const TextField = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  textarea = false,
  rows = 4,
}: Props) => {
  const shared =
    `field-input block w-full pr-14 px-3.5 pt-6 pb-2 text-base text-[var(--colors-text-primary)] bg-[var(--colors-background)] border border-[var(--colors-border-primary)] rounded-theme-lg appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--colors-interactive-primary)] focus:ring-offset-[var(--colors-background)] focus:border-transparent transition-all duration-200 ${className}`

  return (
    <div class={`relative ${className}`}>
      {textarea
        ? <textarea id={name} name={name} rows={rows} required={required} aria-label={label} class={shared} placeholder={placeholder} />
        : <input id={name} name={name} type={type} required={required} aria-label={label} class={shared} placeholder={placeholder} />}
      <span class='field-status-icon pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center leading-none'>
        {/* valid icon */}
        <span class='icon-valid hidden text-[var(--colors-semantic-success)]'>
          <CheckCircleIcon className='w-7 h-7 block' />
        </span>
        {/* invalid icon */}
        <span class='icon-invalid hidden text-[var(--colors-semantic-error)]'>
          <XCircleIcon className='w-7 h-7 block' />
        </span>
      </span>
      <label for={name} class='absolute top-2.5 left-2.5 text-xs text-[var(--colors-text-secondary)] opacity-50 bg-[var(--colors-background)] px-1'>
        {label}
      </label>
    </div>
  )
}
