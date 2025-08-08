import { Shell } from '@components/Shell.tsx'
import { DiscordIcon, FacebookIcon, InstagramIcon, SoundCloudIcon } from '@components/icons/index.ts'
// import ContactForm from '@islands/ContactForm.tsx'

export default function ContactSection() {
  return (
    <>
      {/* Send us a message */}
      <div class='grid gap-8 lg:grid-cols-1'>
        {
          /* <Shell>
          <ContactForm />
        </Shell> */
        }

        <Shell>
          <h2 class='text-3xl font-bold mb-6 text-[var(--colors-text-primary)]'>get in touch</h2>
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
                <a class='text-[var(--colors-text-primary)]' href='mailto:hello@abyssion.com'>hello@abyssion.com</a>
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
                <p class='text-sm text-[var(--colors-text-secondary)]'>Location</p>
                <p class='text-[var(--colors-text-primary)]'>Toronto, ON</p>
              </div>
            </div>
          </div>

          {/* Follow us section moved here */}
          <h2 class='text-3xl font-bold mb-6 mt-10 text-[var(--colors-text-primary)]'>follow us</h2>
          <div class='grid grid-cols-2 gap-4'>
            <a
              href='#'
              class='flex items-center space-x-3 p-3 rounded-lg transition-colors border border-[var(--colors-border-primary)]'
            >
              <FacebookIcon className='w-5 h-5 text-[var(--colors-text-tertiary)]' />
              <span class='text-sm font-medium text-[var(--colors-text-secondary)]'>Facebook</span>
            </a>
            <a
              href='#'
              class='flex items-center space-x-3 p-3 rounded-lg transition-colors border border-[var(--colors-border-primary)]'
            >
              <InstagramIcon className='w-5 h-5 text-[var(--colors-text-tertiary)]' />
              <span class='text-sm font-medium text-[var(--colors-text-secondary)]'>Instagram</span>
            </a>
            <a
              href='#'
              class='flex items-center space-x-3 p-3 rounded-lg transition-colors border border-[var(--colors-border-primary)]'
            >
              <SoundCloudIcon className='w-5 h-5 text-[var(--colors-text-tertiary)]' />
              <span class='text-sm font-medium text-[var(--colors-text-secondary)]'>SoundCloud</span>
            </a>
            <a
              href='#'
              class='flex items-center space-x-3 p-3 rounded-lg transition-colors border border-[var(--colors-border-primary)]'
            >
              <DiscordIcon className='w-5 h-5 text-[var(--colors-text-tertiary)]' />
              <span class='text-sm font-medium text-[var(--colors-text-secondary)]'>Discord</span>
            </a>
          </div>
        </Shell>
      </div>
    </>
  )
}
