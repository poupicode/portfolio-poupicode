import Hero from './components/hero'

export default function Home() {
  return (
    <main className="bg-background overflow-x-hidden">
      <Hero />

      {/* Section de test pour le scroll */}
      <section className="h-screen flex items-center justify-center bg-accent">
        <h2 className="text-4xl">Section suivante (test scroll)</h2>
      </section>
    </main>
  )
}