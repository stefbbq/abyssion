import { Head } from '$fresh/runtime.ts'
import Header from '../islands/Header.tsx'
import BottomNav from '../islands/BottomNav.tsx'
import { Button } from '../atoms/index.ts'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact | abyssion</title>
        <meta name='description' content='Get in touch with abyssion' />
      </Head>

      <div class='min-h-screen bg-gray-50 pb-20 md:pb-0'>
        <Header currentPath='/contact' />

        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold text-gray-900 mb-6'>Contact</h1>
              <p class='text-xl text-gray-600 max-w-2xl mx-auto'>
                Get in touch with us for bookings, collaborations, or just to say hello.
              </p>
            </section>

            <section class='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <div class='grid md:grid-cols-2 gap-12'>
                {/* Contact Form */}
                <div>
                  <h2 class='text-2xl font-bold text-gray-900 mb-6'>Send us a message</h2>
                  <form class='space-y-6'>
                    <div>
                      <label class='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                      <input
                        type='text'
                        class='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder='Your name'
                      />
                    </div>
                    <div>
                      <label class='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                      <input
                        type='email'
                        class='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder='your@email.com'
                      />
                    </div>
                    <div>
                      <label class='block text-sm font-medium text-gray-700 mb-2'>Subject</label>
                      <input
                        type='text'
                        class='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder='What is this about?'
                      />
                    </div>
                    <div>
                      <label class='block text-sm font-medium text-gray-700 mb-2'>Message</label>
                      <textarea
                        rows={6}
                        class='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                        placeholder='Your message...'
                      >
                      </textarea>
                    </div>
                    <Button variant='primary' class='w-full'>
                      Send Message
                    </Button>
                  </form>
                </div>

                {/* Contact Info */}
                <div>
                  <h2 class='text-2xl font-bold text-gray-900 mb-6'>Get in touch</h2>
                  <div class='space-y-6'>
                    <div class='flex items-start space-x-4'>
                      <div class='flex-shrink-0'>
                        <svg class='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class='text-lg font-medium text-gray-900'>Email</h3>
                        <p class='text-gray-600'>contact@abyssion.com</p>
                      </div>
                    </div>

                    <div class='flex items-start space-x-4'>
                      <div class='flex-shrink-0'>
                        <svg class='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
                        <h3 class='text-lg font-medium text-gray-900'>Location</h3>
                        <p class='text-gray-600'>Los Angeles, CA</p>
                      </div>
                    </div>

                    <div class='flex items-start space-x-4'>
                      <div class='flex-shrink-0'>
                        <svg class='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class='text-lg font-medium text-gray-900'>Social Media</h3>
                        <div class='flex space-x-4 mt-2'>
                          <a href='#' class='text-gray-400 hover:text-black transition-colors'>
                            <span class='sr-only'>Instagram</span>
                            <svg class='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                              <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z' />
                            </svg>
                          </a>
                          <a href='#' class='text-gray-400 hover:text-black transition-colors'>
                            <span class='sr-only'>Facebook</span>
                            <svg class='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                              <path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' />
                            </svg>
                          </a>
                          <a href='#' class='text-gray-400 hover:text-black transition-colors'>
                            <span class='sr-only'>SoundCloud</span>
                            <svg class='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                              <path d='M12 1c6.083 0 11 4.917 11 11s-4.917 11-11 11S1 18.083 1 12 5.917 1 12 1zm-3.5 14.5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1-1.5a.5.5 0 00.5-.5v-2a.5.5 0 00-1 0v2a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v3a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1 0a.5.5 0 00.5-.5v-5a.5.5 0 00-1 0v5a.5.5 0 00.5.5zm1-.5a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v4a.5.5 0 00.5.5zm1 .5a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v3a.5.5 0 00.5.5z' />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <BottomNav currentPath='/contact' />
      </div>
    </>
  )
}
