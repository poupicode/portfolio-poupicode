import Hero from './components/hero'
import About from './components/about'
import Projects from './components/projects'

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <About />
      <Projects />
    </main>
  )
}