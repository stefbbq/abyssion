import { ComponentChildren } from 'preact'

type Props = {
  children: ComponentChildren
  className?: string
  imageUrl?: string
  imageAlt?: string
  fallbackAvatarText?: string
}

/**
 * Card component
 * Renders a flexible card with optional image and fallback avatar, using theme-aware background and text colors.
 * Applies .glass-effect and surface-primary background for dark/light mode support.
 */
export const Card = ({ children, className, imageUrl, imageAlt, fallbackAvatarText }: Props) => {
  const handleError = (e: Event) => {
    const target = e.currentTarget as HTMLImageElement
    const parent = target.parentElement

    if (parent && fallbackAvatarText) {
      target.style.display = 'none'
      const fallback = document.createElement('div')
      fallback.className =
        'w-full h-full flex items-center justify-center text-4xl font-bold bg-[var(--colors-surface-secondary)] text-[var(--colors-text-tertiary)]'
      fallback.innerText = fallbackAvatarText
      parent.appendChild(fallback)
    }
  }

  const ImageSection = () => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={imageAlt || ''}
          class='aspect-[9/21] w-full h-full object-cover'
          onError={handleError}
        />
      )
    }

    return (
      <div class='aspect-[9/21] bg-gradient-to-br from-[var(--colors-background-secondary)] to-[var(--colors-background-tertiary)] flex items-center justify-center'>
        {fallbackAvatarText && <span class='text-4xl font-bold text-[var(--colors-text-tertiary)]'>{fallbackAvatarText}</span>}
      </div>
    )
  }

  return (
    <div class={`rounded-2xl shadow-lg glass-effect overflow-hidden flex flex-col bg-[var(--colors-surface-primary)] ${className || ''}`}>
      <ImageSection />
      <div class='p-6 text-center text-[var(--colors-text-primary)]'>
        {children}
      </div>
    </div>
  )
}
