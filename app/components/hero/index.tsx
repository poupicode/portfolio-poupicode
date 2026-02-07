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
      style={{
        background: 'linear-gradient(135deg, #0a0a14 0%, #1a0b2e 25%, #0f0820 50%, #050a1e 75%, #0a0a14 100%)'
      }}
    >
      <MatrixRain />
      <ThreeBackground />
      <TechLogos />
      
      {/* Remplacer l'ancien texte par le nouveau composant */}
      <HeroText />
    </section>
  )
}