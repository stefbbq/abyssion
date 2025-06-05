import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import { Head } from '$fresh/runtime.ts'
import Header from '../../islands/Header.tsx'

// disable app wrapper and layouts for partial routes
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

// Sample band member data
const bandMembers = [
  {
    id: '1',
    name: 'Lorem Ipsum',
    role: 'Consectetur / Adipiscing',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: '/images/member1.jpg', // Placeholder - will need actual images
  },
  {
    id: '2',
    name: 'Dolor Amet',
    role: 'Eiusmod / Tempor',
    bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: '/images/member2.jpg',
  },
  {
    id: '3',
    name: 'Magna Aliqua',
    role: 'Labore / Dolore',
    bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    image: '/images/member3.jpg',
  },
]

export default defineRoute(() => {
  return (
    <Partial name='page-content'>
      <Head>
        <title>Bio | abyssion</title>
        <meta name='description' content='Learn about the band abyssion' />
      </Head>

      <div class='min-h-screen bg-gray-50 pb-20 md:pb-0'>
        <Header currentPath='/bio' />

        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold text-gray-900 mb-6'>Bio</h1>
              <p class='text-xl text-gray-600 max-w-2xl mx-auto'>
                Exploring the depths of electronic music, crafting immersive sonic experiences.
              </p>
            </section>

            <section class='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 class='text-3xl font-bold text-gray-900 mb-6'>About abyssion</h2>
              <div class='prose prose-lg text-gray-600 max-w-none'>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </section>

            <section class='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>Band Members</h2>
              <div class='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {bandMembers.map((member) => (
                  <div key={member.id} class='text-center'>
                    <div class='w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden'>
                      <img
                        src={member.image}
                        alt={member.name}
                        class='w-full h-full object-cover'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML =
                            `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold">${
                              member.name.split(' ').map((n) => n[0]).join('')
                            }</div>`
                        }}
                      />
                    </div>
                    <h3 class='text-xl font-semibold text-gray-900 mb-1'>{member.name}</h3>
                    <p class='text-sm text-gray-500 mb-3'>{member.role}</p>
                    <p class='text-gray-600 text-sm'>{member.bio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section class='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>Ipsum Consectetur</h2>
              <div class='space-y-6'>
                <div class='flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
                  <span class='font-semibold text-gray-900 md:w-24 flex-shrink-0'>2021</span>
                  <span class='flex-1 text-lg font-semibold text-gray-900'>"Dolor Sit Amet"</span>
                  <span class='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>Album • 12 tracks</span>
                </div>
                <div class='flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
                  <span class='font-semibold text-gray-900 md:w-24 flex-shrink-0'>2019</span>
                  <span class='flex-1 text-lg font-semibold text-gray-900'>"Lorem Ipsum Dolor"</span>
                  <span class='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>EP • 5 tracks</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </Partial>
  )
})
