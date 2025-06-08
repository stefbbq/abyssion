import { ComponentChildren } from 'preact'
import { JSX } from 'preact/jsx-runtime'
import { forwardRef } from 'preact/compat'

export type Option = {
  value: string
  label: string
}

export type DropdownProps = {
  options: Option[]
  value?: string
  onChange: (event: JSX.TargetedEvent<HTMLSelectElement>) => void
  children?: ComponentChildren
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ options, value, onChange, children, ...props }, ref) => {
    return (
      <div class='relative w-full'>
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          class='w-full appearance-none bg-transparent pl-3 pr-8 py-2 border rounded-md'
          {...props}
        >
          {children}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div class='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
          <svg class='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fill-rule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clip-rule='evenodd'
            />
          </svg>
        </div>
      </div>
    )
  },
)
