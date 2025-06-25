import { icons as SocialIcons } from '../atoms/icons/index.ts'
import { motion } from 'framer-motion'

/**
 * SocialLinks
 * Renders a row of social link icons with hover color transitions.
 * Expects props.socialLinks (array) and props.theme (object).
 */
type SocialLink = {
  key: string
  url: string
  icon: string
}

type SocialLinksProps = {
  props: {
    socialLinks: SocialLink[]
    theme?: any
  }
  animation?: any
}

export const SocialLinks = ({ props, animation = {} }: SocialLinksProps) => {
  if (!props?.socialLinks) return null
  return (
    <motion.div {...animation} class='flex items-center justify-center space-x-8 pt-2'>
      {props.socialLinks.map(({ key, url, icon }) => {
        const IconComponent = SocialIcons[icon as keyof typeof SocialIcons] || (() => <div class='w-6 h-6 rounded bg-current opacity-30' />)
        return (
          <a
            key={key}
            href={url}
            className='transition-colors'
            style={{ color: props.theme?.colors?.text?.secondary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = props.theme?.colors?.text?.primary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = props.theme?.colors?.text?.secondary)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <IconComponent className='w-6 h-6 opacity-60' />
          </a>
        )
      })}
    </motion.div>
  )
}
