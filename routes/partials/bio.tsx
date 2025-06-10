import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import bandMembers from '@data/content-bio-members.json' with { type: 'json' }
import bioAbout from '@data/content-bio-about.json' with { type: 'json' }
import bioAlbums from '@data/content-bio-music.json' with { type: 'json' }
import bioSections from '@data/content-bio-sections.json' with { type: 'json' }
import type { Album, BandMember, BioSection } from '@data/types.ts'
import { getTheme } from '@lib/theme/index.ts'

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  const theme = getTheme()

  return (
    <>
      <Head>
        <title>{bioSections.mainTitle} | abyssion</title>
        <meta name='description' content='Learn about the band abyssion' />
      </Head>

      <div class='min-h-screen pb-20 md:pb-0'>
        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>{bioSections.mainTitle}</h1>
              <p class='text-xl max-w-2xl mx-auto' style={{ color: theme.colors.text.secondary }}>
                {bioSections.mainDescription}
              </p>
            </section>

            <section
              class='rounded-2xl shadow-sm p-8'
              style={{ backgroundColor: theme.colors.surface.primary, border: `1px solid ${theme.colors.border.primary}` }}
            >
              <h2 class='text-3xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>{bioSections.aboutTitle}</h2>
              <div class='prose prose-lg max-w-none' style={{ color: theme.colors.text.secondary }}>
                {bioAbout.map((paragraph: string, idx: number) => <p key={idx}>{paragraph}</p>)}
              </div>
            </section>

            <section
              class='rounded-2xl shadow-sm p-8'
              style={{ backgroundColor: theme.colors.surface.primary, border: `1px solid ${theme.colors.border.primary}` }}
            >
              <h2 class='text-3xl font-bold mb-8' style={{ color: theme.colors.text.primary }}>
                {(bioSections as BioSection).membersTitle}
              </h2>
              <div class='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {bandMembers.map((member: BandMember) => (
                  <div key={member.id} class='text-center'>
                    <div
                      class='w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden'
                      style={{ backgroundColor: theme.colors.background.secondary }}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        class='w-full h-full object-cover'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.innerHTML =
                              `<div class="w-full h-full flex items-center justify-center text-2xl font-bold" style="background-color: ${theme.colors.background.tertiary}; color: ${theme.colors.text.tertiary};">${
                                member.name.split(' ').map((n: string) => n[0]).join('')
                              }</div>`
                          }
                        }}
                      />
                    </div>
                    <h3 class='text-xl font-semibold mb-1' style={{ color: theme.colors.text.primary }}>{member.name}</h3>
                    <p class='text-sm mb-3' style={{ color: theme.colors.text.tertiary }}>{member.role}</p>
                    <p class='text-sm' style={{ color: theme.colors.text.secondary }}>{member.bio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              class='rounded-2xl shadow-sm p-8'
              style={{ backgroundColor: theme.colors.surface.primary, border: `1px solid ${theme.colors.border.primary}` }}
            >
              <h2 class='text-3xl font-bold mb-8' style={{ color: theme.colors.text.primary }}>
                {(bioSections as BioSection).albumsTitle}
              </h2>
              <div class='space-y-6'>
                {bioAlbums.map((album: Album, idx: number) => (
                  <div
                    key={idx}
                    class='flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg transition-colors'
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span class='font-semibold md:w-24 flex-shrink-0' style={{ color: theme.colors.text.primary }}>
                      {album.year}
                    </span>
                    <span class='flex-1 text-lg font-semibold' style={{ color: theme.colors.text.primary }}>
                      "{album.title}"
                    </span>
                    <span
                      class='text-sm px-3 py-1 rounded-full'
                      style={{ color: theme.colors.text.tertiary, backgroundColor: theme.colors.background.secondary }}
                    >
                      {album.type} • {album.tracks} tracks
                    </span>
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
