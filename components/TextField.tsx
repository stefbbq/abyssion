import { useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'

type Props = {
  // field label (floating)
  label: string
  // field name/ID
  name: string
  // input type (default: 'text')
  type?: string
  // placeholder text
  placeholder?: string
  // controlled value
  value?: string
  // change handler
  onChange?: (value: string) => void
  // validation function (returns error string or null)
  validate?: (value: string) => string | null
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
 * Modern, accessible text field with animated floating label and validation.
 * Label starts full-size inside, animates to top-left, shrinks, and fades on focus or filled.
 * Supports both <input> and <textarea> modes, with theme-aware styling.
 * Uses theme-aware border radius for consistent styling.
 *
 * @example
 *   <TextField label='Name' name='name' required />
 *   <TextField label='Message' name='msg' textarea rows={6} />
 */
export const TextField = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  value: controlledValue,
  onChange,
  validate,
  required = false,
  className = '',
  textarea = false,
  rows = 4,
}: Props) => {
  const [value, setValue] = useState(controlledValue || '')
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>) => {
    const val = e.currentTarget.value
    setValue(val)
    onChange?.(val)
    if (validate) setError(validate(val))
  }

  const handleFocus = () => setIsFocused(true)

  const handleBlur = () => {
    setIsFocused(false)
    setTouched(true)
    if (validate) setError(validate(value))
  }

  const isFloating = isFocused || value.length > 0

  const sharedProps = {
    id: name,
    name,
    value: controlledValue !== undefined ? controlledValue : value,
    onInput: handleInput,
    onFocus: handleFocus,
    onBlur: handleBlur,
    required,
    placeholder,
    'aria-label': label,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${name}-error` : undefined,
    class:
      `block w-full px-3.5 pt-6 pb-2 text-base text-[var(--colors-text-primary)] bg-[var(--colors-surface-primary)] border border-[var(--colors-border-primary)] rounded-theme-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--colors-interactive-primary)] focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-500' : ''
      } ${className}`,
  }

  return (
    <div class={`relative ${className}`}>
      {/* textarea */}
      {textarea && (
        <textarea
          {...{ ...sharedProps, rows }}
          ref={textareaRef}
        />
      )}

      {/* input */}
      {!textarea && (
        <input
          {...{ ...sharedProps, type }}
          ref={inputRef}
        />
      )}

      {/* label */}
      <label
        for={name}
        class={`absolute transition-all duration-200 ease-in-out origin-top-left
          ${
          isFloating
            ? 'top-2.5 left-2.5 text-xs text-[var(--colors-text-secondary)] opacity-40 translate-y-0'
            : 'top-4 left-3 text-base text-[var(--colors-text-tertiary)] opacity-100 -translate-y-0'
        }
          bg-[var(--colors-surface-primary)] px-1
        `}
        style={{
          zIndex: 2,
          transitionProperty: 'top, left, font-size, opacity, color, background, transform',
        }}
      >
        {label}
      </label>

      {/* on error */}
      {error && touched && (
        <span id={`${name}-error`} class='text-xs text-red-500 mt-1 block'>
          {error}
        </span>
      )}
    </div>
  )
}
