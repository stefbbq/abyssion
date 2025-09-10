type Props = {
  name: string
  label?: string
  error?: string | null
  required?: boolean
  className?: string
  labelNode?: preact.ComponentChildren
}

/**
 * toggle
 * accessible, form-native switch backed by a checkbox input
 */
export const Toggle = ({ name, label, error, required, className, labelNode }: Props) => {
  const inputId = name

  const wrapperClasses = `flex items-center gap-3 text-sm ${error ? 'text-red-500' : 'text-[var(--colors-text-primary)]'} ${className || ''}`

  return (
    <label for={inputId} class={wrapperClasses.trim()}>
      <input
        id={inputId}
        type='checkbox'
        name={name}
        value='yes'
        required={!!required}
        class='peer sr-only'
      />
      <span
        class='
          cursor-pointer
          relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
          border border-[var(--colors-border-primary)]
          bg-[var(--colors-background)]
          transition-colors duration-300 ease-out
          peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
          peer-focus:ring-[var(--colors-interactive-focus)] peer-focus:ring-offset-[var(--colors-background)]
          peer-checked:bg-[var(--colors-interactive-primary)]
          peer-checked:[&>span]:translate-x-5 peer-checked:[&>span]:scale-105
          peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
        '
        aria-hidden='true'
      >
        <span class='
            pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full
            bg-[var(--colors-foreground)] shadow
            transition-transform duration-300 ease-out will-change-transform
            translate-x-0 peer-active:scale-95
          ' />
      </span>
      {labelNode ?? <span>{label}</span>}
    </label>
  )
}

export default Toggle
