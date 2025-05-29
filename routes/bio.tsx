import { Fragment, h } from 'preact'
import { Head } from '$fresh/runtime.ts'

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

export default function Bio() {
  return (
    <>
      <Head>
        <title>Bio | abyssion</title>
        <meta name='description' content='About abyssion - band history and members' />
      </Head>

      <div class='min-h-screen bg-gray-100'>
        <header class='bg-black text-white p-6'>
          <div class='max-w-6xl mx-auto'>
            <nav class='flex justify-between items-center'>
              <a href='/' class='text-2xl font-bold'>abyssion</a>
              <div class='space-x-6'>
                <a href='/shows' class='hover:underline'>Shows</a>
                <a href='/bio' class='hover:underline font-medium'>Bio</a>
              </div>
            </nav>
          </div>
        </header>

        <main class='max-w-6xl mx-auto p-6'>
          <h1 class='text-4xl font-bold mb-8'>Lorem Ipsum Dolor</h1>

          <section class='mb-12 bg-white p-8 rounded-lg shadow-md'>
            <h2 class='text-2xl font-bold mb-4'>Lorem Ipsum</h2>
            <div class='prose max-w-none'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p class='mt-4'>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
                omnis iste natus error sit voluptatem accusantium doloremque laudantium.
              </p>
              <p class='mt-4'>
                Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.
              </p>
            </div>
          </section>

          <section>
            <h2 class='text-2xl font-bold mb-6'>Consectetur Adipiscing</h2>
            <div class='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {bandMembers.map((member) => (
                <div key={member.id} class='bg-white rounded-lg shadow-md overflow-hidden'>
                  <div class='aspect-w-4 aspect-h-3 bg-gray-200'>
                    {/* Placeholder for member image */}
                    <div class='w-full h-48 flex items-center justify-center bg-gray-300'>
                      <span class='text-gray-500'>Photo</span>
                    </div>
                  </div>
                  <div class='p-6'>
                    <h3 class='text-xl font-bold'>{member.name}</h3>
                    <p class='text-gray-600 mb-3'>{member.role}</p>
                    <p>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section class='mt-12 bg-white p-8 rounded-lg shadow-md'>
            <h2 class='text-2xl font-bold mb-4'>Ipsum Consectetur</h2>
            <ul class='space-y-4'>
              <li class='flex flex-col md:flex-row md:items-center'>
                <span class='font-medium md:w-1/4'>2021</span>
                <span class='md:w-1/2 font-bold'>"Dolor Sit Amet" (Album)</span>
                <span class='text-gray-600'>12 tracks</span>
              </li>
              <li class='flex flex-col md:flex-row md:items-center'>
                <span class='font-medium md:w-1/4'>2019</span>
                <span class='md:w-1/2 font-bold'>"Lorem Ipsum Dolor" (EP)</span>
                <span class='text-gray-600'>5 tracks</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </>
  )
}
