import HomeSection from './partials/home.tsx'
import ShowsSection from './partials/shows.tsx'
import BioSection from './partials/bio.tsx'
import ContactSection from './partials/contact.tsx'

export default function MainPage() {
  return (
    <main class=''>
      <section id='home' className='min-h-screen'>
        <HomeSection />
      </section>
      <section
        id='shows'
        className='bg-gray-100 min-h-screen pt-24 pb-8 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 sm:pt-5 relative z-10 space-y-6'
      >
        <ShowsSection />
      </section>
      <section
        id='bio'
        className='bg-gray-200 min-h-screen pt-24 pb-8 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 sm:pt-5 relative z-10 space-y-6'
      >
        <BioSection />
      </section>
      <section
        id='contact'
        className='bg-gray-300 min-h-screen pt-24 pb-8 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 sm:pt-5 relative z-10 space-y-6'
      >
        <ContactSection />
      </section>
    </main>
  )
}
