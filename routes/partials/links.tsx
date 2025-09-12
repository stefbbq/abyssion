import nav from '@data/nav.json' with { type: 'json' }
import { Shell } from '@components/Shell.tsx'
import { Title } from '@components/Title.tsx'
import { Button } from '@components/Button.tsx'
import { icons } from '@components/icons/index.ts'

export default function LinksPartial() {
  return (
    <Shell>
      <Title>follow us</Title>
      <div class='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {nav.socialLinks.map((link: { key: string; url: string; label: string; icon?: string }) => {
          const Icon = link.icon ? icons[link.icon as keyof typeof icons] : undefined
          return (
            <Button
              key={link.key}
              href={link.url}
              variant='primary'
              size='md'
              hoverReveal
              class='group w-full justify-start items-center h-12 shadow-sm'
            >
              <span class='relative z-10 flex items-center gap-3 w-full'>
                {Icon ? <Icon className='w-5 h-5 text-current flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity' /> : null}
                <span class='text-sm font-medium text-current whitespace-nowrap'>
                  {link.label}
                </span>
              </span>
            </Button>
          )
        })}
      </div>
    </Shell>
  )
}
