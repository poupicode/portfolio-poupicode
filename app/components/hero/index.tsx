'use client'
import MatrixRain from './MatrixRain'
import ThreeBackground from './ThreeBackground'
import TechLogos from './TechLogos'
import HeroText from './HeroText'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
    >
      <MatrixRain />
      <ThreeBackground />
      <TechLogos />

      {/* Remplacer l'ancien texte par le nouveau composant */}
      <HeroText />
    </section>
  )
}