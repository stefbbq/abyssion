import { ComponentChildren } from 'preact'
import { useRef } from 'preact/hooks'

type SectionProps = {
  id: string
  children: ComponentChildren
  fullHeight?: boolean
  lastSection?: boolean
}

/**
 * Section component with standardized container layout
 * Renders a <section> with consistent spacing and structure
 */
export const Section = ({ id, children, fullHeight = false, lastSection = false }: SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${fullHeight ? 'min-h-screen' : ''} ${lastSection ? 'pb-28 md:pb-8' : ''}`}
    >
      <div className='max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 relative z-10 space-y-8'>
        {children}
      </div>
    </section>
  )
}
