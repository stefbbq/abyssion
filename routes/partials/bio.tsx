import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import bandMembers from '@data/content-bio-members.json' with { type: 'json' }
import bioAbout from '@data/content-bio-about.json' with { type: 'json' }
import bioAlbums from '@data/content-bio-music.json' with { type: 'json' }
import bioSections from '@data/content-bio-sections.json' with { type: 'json' }
import type { Album, BandMember, BioSection } from '@data/types.ts'

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  return (
    <>
      <Head>
        <title>{bioSections.mainTitle} | abyssion</title>
        <meta name='description' content='Learn about the band abyssion' />
      </Head>

      <div class='min-h-screen bg-gray-50 pb-20 md:pb-0'>
        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold text-gray-900 mb-6'>{bioSections.mainTitle}</h1>
              <p class='text-xl text-gray-600 max-w-2xl mx-auto'>
                {bioSections.mainDescription}
              </p>
            </section>

            <section class='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 class='text-3xl font-bold text-gray-900 mb-6'>{bioSections.aboutTitle}</h2>
              <div class='prose prose-lg text-gray-600 max-w-none'>
                {bioAbout.map((paragraph: string, idx: number) => <p key={idx}>{paragraph}</p>)}
              </div>
            </section>

            <section class='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>{(bioSections as BioSection).membersTitle}</h2>
              <div class='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {bandMembers.map((member: BandMember) => (
                  <div key={member.id} class='text-center'>
                    <div class='w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden'>
                      <img
                        src={member.image}
                        alt={member.name}
                        class='w-full h-full object-cover'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML =
                            `<div class=\"w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold\">${
                              member.name.split(' ').map((n: string) => n[0]).join('')
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
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>{(bioSections as BioSection).albumsTitle}</h2>
              <div class='space-y-6'>
                {bioAlbums.map((album: Album, idx: number) => (
                  <div key={idx} class='flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
                    <span class='font-semibold text-gray-900 md:w-24 flex-shrink-0'>{album.year}</span>
                    <span class='flex-1 text-lg font-semibold text-gray-900'>"{album.title}"</span>
                    <span class='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>{album.type} • {album.tracks} tracks</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
})
