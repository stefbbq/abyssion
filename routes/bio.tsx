import { h, Fragment } from "preact";
import { Head } from "$fresh/runtime.ts";

// Sample band member data
const bandMembers = [
  {
    id: "1",
    name: "Alex Rivers",
    role: "Vocals / Guitar",
    bio: "Founder of abyssion, Alex has been playing guitar for over 15 years and draws inspiration from post-rock and ambient electronic music.",
    image: "/images/member1.jpg" // Placeholder - will need actual images
  },
  {
    id: "2",
    name: "Morgan Lee",
    role: "Bass / Synth",
    bio: "Coming from a classical background, Morgan brings melodic complexity and harmonic depth to the band's sound.",
    image: "/images/member2.jpg"
  },
  {
    id: "3",
    name: "Jamie Chen",
    role: "Drums / Percussion",
    bio: "Jamie's intricate rhythms and experimental approach to percussion form the foundation of abyssion's sonic landscape.",
    image: "/images/member3.jpg"
  }
]

export default function Bio() {
  return (
    <>
      <Head>
        <title>Bio | abyssion</title>
        <meta name="description" content="About abyssion - band history and members" />
      </Head>
      
      <div class="min-h-screen bg-gray-100">
        <header class="bg-black text-white p-6">
          <div class="max-w-6xl mx-auto">
            <nav class="flex justify-between items-center">
              <a href="/" class="text-2xl font-bold">abyssion</a>
              <div class="space-x-6">
                <a href="/shows" class="hover:underline">Shows</a>
                <a href="/bio" class="hover:underline font-medium">Bio</a>
              </div>
            </nav>
          </div>
        </header>
        
        <main class="max-w-6xl mx-auto p-6">
          <h1 class="text-4xl font-bold mb-8">About abyssion</h1>
          
          <section class="mb-12 bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Our Story</h2>
            <div class="prose max-w-none">
              <p>
                Formed in the underground music scene of 2018, abyssion emerged from a shared vision 
                to create music that blends atmospheric textures with driving rhythms and emotional depth.
              </p>
              <p class="mt-4">
                The band quickly gained recognition for their immersive live performances and the 
                distinctive sonic landscapes captured on their debut EP "Echoes in the Void" (2019). 
                Following this initial success, abyssion expanded their sound palette on their first 
                full-length album "Beneath the Surface" (2021), which received critical acclaim for 
                its innovative approach to genre boundaries.
              </p>
              <p class="mt-4">
                Drawing from diverse influences ranging from post-rock and ambient to electronic and 
                progressive genres, abyssion continues to evolve their unique soundscape while 
                maintaining the emotional core that defines their artistic identity.
              </p>
            </div>
          </section>
          
          <section>
            <h2 class="text-2xl font-bold mb-6">Band Members</h2>
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {bandMembers.map(member => (
                <div key={member.id} class="bg-white rounded-lg shadow-md overflow-hidden">
                  <div class="aspect-w-4 aspect-h-3 bg-gray-200">
                    {/* Placeholder for member image */}
                    <div class="w-full h-48 flex items-center justify-center bg-gray-300">
                      <span class="text-gray-500">Photo</span>
                    </div>
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-bold">{member.name}</h3>
                    <p class="text-gray-600 mb-3">{member.role}</p>
                    <p>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section class="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Discography</h2>
            <ul class="space-y-4">
              <li class="flex flex-col md:flex-row md:items-center">
                <span class="font-medium md:w-1/4">2021</span>
                <span class="md:w-1/2 font-bold">"Beneath the Surface" (Album)</span>
                <span class="text-gray-600">12 tracks</span>
              </li>
              <li class="flex flex-col md:flex-row md:items-center">
                <span class="font-medium md:w-1/4">2019</span>
                <span class="md:w-1/2 font-bold">"Echoes in the Void" (EP)</span>
                <span class="text-gray-600">5 tracks</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </>
  )
} 