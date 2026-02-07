'use client'
import MatrixRain from './MatrixRain'
import ThreeBackground from './ThreeBackground'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a14 0%, #1a0b2e 25%, #0f0820 50%, #050a1e 75%, #0a0a14 100%)'
      }}
    >
      {/* Couche 1 : Matrix */}
      <MatrixRain />

      {/* Couche 2 : Réseau 3D Three.js */}
      <ThreeBackground />

      {/* Couche 3 : Logos tech (à venir) */}
      <div
        id="tech-logos"
        className="absolute inset-0 z-30 pointer-events-none"
      >
        {/* Les logos iront ici */}
      </div>

      {/* Couche 4 : Texte principal */}
      <div className="absolute inset-0 z-40 flex items-center justify-center">
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