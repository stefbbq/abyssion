import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { Button } from '@atoms/Button.tsx'
import { getTheme } from '@lib/theme/index.ts'

// disable app wrapper and layouts for partial routes
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  const theme = getTheme()
  const inputStyles = {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.primary}`,
    color: theme.colors.text.primary,
    '--focus-ring-color': theme.colors.interactive.primary,
  }
  const focusClasses = 'focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:border-transparent'

  return (
    <>
      <Head>
        <title>Contact | abyssion</title>
        <meta name='description' content='Get in touch with abyssion' />
      </Head>

      <div class='min-h-screen pb-20 md:pb-0' style={{ backgroundColor: `${theme.colors.background.primary}CC` }}>
        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <p class='text-xl max-w-2xl mx-auto' style={{ color: theme.colors.text.secondary }}>
                Get in touch with us for bookings, collaborations, or just to say hello.
              </p>
            </section>

            <div class='grid gap-8 lg:grid-cols-2'>
              {/* Contact Form */}
              <section
                class='rounded-2xl shadow-sm p-8'
                style={{ backgroundColor: theme.colors.surface.primary, border: `1px solid ${theme.colors.border.primary}` }}
              >
                <h2 class='text-2xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>Send us a message</h2>
                <form class='space-y-6'>
                  <div>
                    <label for='name' class='block text-sm font-medium mb-2' style={{ color: theme.colors.text.secondary }}>
                      Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      class={`w-full px-4 py-2 rounded-lg ${focusClasses}`}
                      style={inputStyles}
                      placeholder='Your name'
                    />
                  </div>
                  <div>
                    <label for='email' class='block text-sm font-medium mb-2' style={{ color: theme.colors.text.secondary }}>
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      class={`w-full px-4 py-2 rounded-lg ${focusClasses}`}
                      style={inputStyles}
                      placeholder='your@email.com'
                    />
                  </div>
                  <div>
                    <label for='subject' class='block text-sm font-medium mb-2' style={{ color: theme.colors.text.secondary }}>
                      Subject
                    </label>
                    <input
                      type='text'
                      id='subject'
                      name='subject'
                      class={`w-full px-4 py-2 rounded-lg ${focusClasses}`}
                      style={inputStyles}
                      placeholder='What is this about?'
                    />
                  </div>
                  <div>
                    <label for='message' class='block text-sm font-medium mb-2' style={{ color: theme.colors.text.secondary }}>
                      Message
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      rows={5}
                      class={`w-full px-4 py-2 rounded-lg ${focusClasses}`}
                      style={inputStyles}
                      placeholder='Your message...'
                    >
                    </textarea>
                  </div>
                  <Button type='submit' variant='primary' class='w-full'>
                    Send Message
                  </Button>
                </form>
              </section>

              {/* Contact Information */}
              <section class='space-y-8'>
                <div
                  class='rounded-2xl shadow-sm p-8'
                  style={{ backgroundColor: theme.colors.surface.primary, border: `1px solid ${theme.colors.border.primary}` }}
                >
                  <h2 class='text-2xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>Get in touch</h2>
                  <div class='space-y-4'>
                    <div class='flex items-center space-x-3'>
                      <div class='flex-shrink-0'>
                        <svg
                          class='w-5 h-5'
                          style={{ color: theme.colors.text.tertiary }}
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
                        <p class='text-sm' style={{ color: theme.colors.text.secondary }}>Email</p>
                        <p style={{ color: theme.colors.text.primary }}>hello@abyssion.com</p>
                      </div>
                    </div>
                    <div class='flex items-center space-x-3'>
                      <div class='flex-shrink-0'>
                        <svg
                          class='w-5 h-5'
                          style={{ color: theme.colors.text.tertiary }}
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
                        <p class='text-sm' style={{ color: theme.colors.text.secondary }}>Location</p>
                        <p style={{ color: theme.colors.text.primary }}>Berlin, Germany</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div
                  class='rounded-2xl shadow-sm p-8'
                  style={{ backgroundColor: theme.colors.surface.primary, border: `1px solid ${theme.colors.border.primary}` }}
                >
                  <h2 class='text-2xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>Follow us</h2>
                  <div class='grid grid-cols-2 gap-4'>
                    <a
                      href='#'
                      class='flex items-center space-x-3 p-3 rounded-lg transition-colors'
                      style={{ border: `1px solid ${theme.colors.border.primary}` }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.colors.border.secondary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.colors.border.primary}
                    >
                      <svg class='w-5 h-5' style={{ color: theme.colors.text.tertiary }} fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' />
                      </svg>
                      <span class='text-sm font-medium' style={{ color: theme.colors.text.secondary }}>Facebook</span>
                    </a>
                    <a
                      href='#'
                      class='flex items-center space-x-3 p-3 rounded-lg transition-colors'
                      style={{ border: `1px solid ${theme.colors.border.primary}` }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.colors.border.secondary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.colors.border.primary}
                    >
                      <svg class='w-5 h-5' style={{ color: theme.colors.text.tertiary }} fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.562-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z' />
                      </svg>
                      <span class='text-sm font-medium' style={{ color: theme.colors.text.secondary }}>Instagram</span>
                    </a>
                    <a
                      href='#'
                      class='flex items-center space-x-3 p-3 rounded-lg transition-colors'
                      style={{ border: `1px solid ${theme.colors.border.primary}` }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.colors.border.secondary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.colors.border.primary}
                    >
                      <svg class='w-5 h-5' style={{ color: theme.colors.text.tertiary }} fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 1c6.083 0 11 4.917 11 11s-4.917 11-11 11S1 18.083 1 12 5.917 1 12 1zm-3.5 14.5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1-1.5a.5.5 0 00.5-.5v-2a.5.5 0 00-1 0v2a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v3a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1 0a.5.5 0 00.5-.5v-5a.5.5 0 00-1 0v5a.5.5 0 00.5.5zm1-.5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v3a.5.5 0 00.5.5z' />
                      </svg>
                      <span class='text-sm font-medium' style={{ color: theme.colors.text.secondary }}>SoundCloud</span>
                    </a>
                    <a
                      href='#'
                      class='flex items-center space-x-3 p-3 rounded-lg transition-colors'
                      style={{ border: `1px solid ${theme.colors.border.primary}` }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.colors.border.secondary}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.colors.border.primary}
                    >
                      <svg class='w-5 h-5' style={{ color: theme.colors.text.tertiary }} fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' />
                      </svg>
                      <span class='text-sm font-medium' style={{ color: theme.colors.text.secondary }}>Discord</span>
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  )
})
