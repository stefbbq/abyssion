import { ComponentChildren } from 'preact'

type Props = {
  children: ComponentChildren
  className?: string
  imageUrl?: string
  imageAlt?: string
  fallbackAvatarText?: string
}

export const Card = ({ children, className, imageUrl, imageAlt, fallbackAvatarText }: Props) => {
  const handleError = (e: Event) => {
    const target = e.currentTarget as HTMLImageElement
    const parent = target.parentElement

    if (parent && fallbackAvatarText) {
      target.style.display = 'none'
      const fallback = document.createElement('div')
      fallback.className = 'w-full h-full flex items-center justify-center text-4xl font-bold bg-background-tertiary text-text-tertiary'
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
      <div class='aspect-[9/21] bg-gradient-to-br from-background-secondary to-background-tertiary flex items-center justify-center'>
        {fallbackAvatarText && <span class='text-4xl font-bold text-text-tertiary'>{fallbackAvatarText}</span>}
      </div>
    )
  }

  return (
    <div class={`rounded-2xl shadow-lg glass-effect overflow-hidden flex flex-col ${className || ''}`}>
      <ImageSection />
      <div class='p-6 text-center'>
        {children}
      </div>
    </div>
  )
}
