import { Shell } from '@components/Shell.tsx'
import contact from '@data/content-contact.json' with { type: 'json' }
import nav from '@data/nav.json' with { type: 'json' }
import { icons } from '@components/icons/index.ts'
import { Title } from '@components/Title.tsx'
// import ContactForm from '@islands/ContactForm.tsx'

export default function ContactSection() {
  return (
    <>
      {/* send us a message */}
      <div class='grid gap-8 lg:grid-cols-1'>
        {
          /* <Shell>
          <ContactForm />
        </Shell> */
        }

        <Shell>
          <Title>{contact.title}</Title>
          <div class='space-y-4'>
            <div class='flex items-center space-x-3'>
              <div class='flex-shrink-0'>
                <svg
                  class='w-5 h-5 text-[var(--colors-text-tertiary)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div>
                <a class='text-[var(--colors-text-primary)]' href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </div>
            <div class='flex items-center space-x-3'>
              <div class='flex-shrink-0'>
                <svg
                  class='w-5 h-5 text-[var(--colors-text-tertiary)]'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <div>
                <p class='text-sm text-[var(--colors-text-secondary)]'>{contact.locationLabel}</p>
                <p class='text-[var(--colors-text-primary)]'>{contact.location}</p>
              </div>
            </div>
          </div>
        </Shell>

        <Shell>
          <Title>follow us</Title>
          <div class='grid grid-cols-2 gap-4'>
            {nav.socialLinks.map((link: { key: string; url: string; label: string; icon?: string }) => {
              const Icon = link.icon ? icons[link.icon as keyof typeof icons] : undefined
              return (
                <a
                  key={link.key}
                  href={link.url}
                  class='flex items-center space-x-3 p-3 rounded-lg transition-colors border border-[var(--colors-border-primary)]'
                >
                  {Icon ? <Icon className='w-5 h-5 text-[var(--colors-text-tertiary)]' /> : null}
                  <span class='text-sm font-medium text-[var(--colors-text-secondary)]'>{link.label}</span>
                </a>
              )
            })}
          </div>
        </Shell>
      </div>
    </>
  )
}
