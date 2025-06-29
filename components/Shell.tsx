import { ComponentChildren } from 'preact'

type ShellProps = {
  children: ComponentChildren
  className?: string
}

export const Shell = ({ children, className }: ShellProps) => {
  return (
    <section
      class={`rounded-2xl shadow-lg p-8 glass-effect ${className || ''}`}
    >
      {children}
    </section>
  )
}
