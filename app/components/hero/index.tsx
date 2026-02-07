'use client'
import MatrixRain from './MatrixRain'
import ThreeBackground from './ThreeBackground'
import TechLogos from './TechLogos'

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
      
      {/* Couche 3 : Logos tech */}
      <TechLogos />

      {/* Couche 4 : Texte */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
        <h1 
          id="hero-text"
          className="text-center font-bold leading-none text-foreground"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
          }}
        >
          <div>Gilles</div>
          <div>Marchesse</div>
        </h1>
      </div>
    </section>
  )
}