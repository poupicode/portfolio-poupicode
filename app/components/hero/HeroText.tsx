'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gillesRef = useRef<HTMLDivElement>(null)
  const marchesseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !gillesRef.current || !marchesseRef.current) return

    // Égaliser les largeurs avec font-stretch
    const equalizeWidths = () => {
      const gillesWidth = gillesRef.current!.offsetWidth
      const marchesseWidth = marchesseRef.current!.offsetWidth

      if (gillesWidth < marchesseWidth) {
        const ratio = marchesseWidth / gillesWidth
        const stretchPercent = Math.min(ratio * 100, 150)
        gillesRef.current!.style.fontStretch = `${stretchPercent}%`
      }
    }

    setTimeout(equalizeWidths, 100)

    // Animation d'apparition stylée
    const tl = gsap.timeline({ delay: 0.8 })

    // GILLES : apparaît depuis le bas avec blur
    tl.fromTo(gillesRef.current,
      {
        opacity: 0,
        y: 100,
        filter: 'blur(20px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out'
      }
    )

    // MARCHESSE : apparaît juste après avec le même effet
    tl.fromTo(marchesseRef.current,
      {
        opacity: 0,
        y: 100,
        filter: 'blur(20px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out'
      },
      '-=0.8' // Overlap pour que ça soit fluide
    )

    // Glow subtil qui pulse en boucle
    tl.to([gillesRef.current, marchesseRef.current],
      {
        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      },
      '-=0.5'
    )

    window.addEventListener('resize', equalizeWidths)
    return () => window.removeEventListener('resize', equalizeWidths)

  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-0 pointer-events-none"
    >
      <div
        ref={gillesRef}
        className="hero-line"
        style={{
          fontSize: 'clamp(5rem, 18vw, 16rem)',
          fontWeight: 400,
          color: '#ffffff',
          lineHeight: 0.85,
          textAlign: 'center',
          textTransform: 'uppercase',
          fontStretch: '100%',
        }}
      >
        GILLES
      </div>
      
      <div
        ref={marchesseRef}
        className="hero-line"
        style={{
          fontSize: 'clamp(5rem, 18vw, 16rem)',
          fontWeight: 400,
          color: '#ffffff',
          lineHeight: 0.85,
          textAlign: 'center',
          textTransform: 'uppercase',
          fontStretch: '100%',
        }}
      >
        MARCHESSE
      </div>
    </div>
  )
}