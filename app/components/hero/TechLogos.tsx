'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function TechLogos() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const mouseRef = useRef({ x: 0, y: 0 })
    const animationsRef = useRef<Map<HTMLElement, gsap.core.Tween[]>>(new Map())

    const logos = [
        { name: 'React', svg: '/images/hero/react-svgrepo-com.svg', color: '#61dafb' },
        { name: 'Docker', svg: '/images/hero/docker-icon-svgrepo-com.svg', color: '#2496ed' },
        { name: 'Node.js', svg: '/images/hero/node-js-svgrepo-com.svg', color: '#339933' },
        { name: 'Laravel', svg: '/images/hero/laravel-svgrepo-com.svg', color: '#ff2d20' },
        { name: 'SQL', svg: '/images/hero/sql-svgrepo-com.svg', color: '#FFDB43' },
    ]

    const positions = [
        { left: '18%', top: '20%' },
        { left: '9%', top: '65%' },
        { right: '18%', top: '15%' },
        { right: '10%', top: '50%' },
        { right: '17%', top: '80%' },
    ]

    // Fonction pour démarrer la lévitation d'un logo
    const startLevitation = (logo: HTMLElement) => {
        const amplitude = Math.random() * 20 + 30
        const duration = Math.random() * 2 + 2
        const rotationAngle = (Math.random() - 0.5) * 20
        const rotationDuration = Math.random() * 3 + 2

        const tweenY = gsap.to(logo, {
            y: amplitude,
            duration: duration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        })

        const tweenRotation = gsap.to(logo, {
            rotation: rotationAngle,
            duration: rotationDuration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        })

        animationsRef.current.set(logo, [tweenY, tweenRotation])
    }

    // Fonction pour arrêter la lévitation d'un logo
    const stopLevitation = (logo: HTMLElement) => {
        const tweens = animationsRef.current.get(logo)
        if (tweens) {
            tweens.forEach(tween => tween.kill())
            animationsRef.current.delete(logo)
        }
    }

    useEffect(() => {
        setMounted(true)

        if (!containerRef.current) return

        const logoElements = containerRef.current.querySelectorAll('.tech-logo')

        // Démarrer lévitation pour tous les logos
        logoElements.forEach((logo) => {
            gsap.from(logo, {
                opacity: 0,
                scale: 0,
                duration: 1,
                delay: Math.random() * 0.5,
                ease: 'back.out'
            })

            startLevitation(logo as HTMLElement)
        })

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }

            logoElements.forEach((logo) => {
                if (logo.classList.contains('hovered')) return

                const rect = logo.getBoundingClientRect()
                const logoX = rect.left + rect.width / 2
                const logoY = rect.top + rect.height / 2

                // Distance totale
                const distance = Math.sqrt(
                    (logoX - e.clientX) ** 2 + (logoY - e.clientY) ** 2
                )

                // Calculer la force d'attraction (diminue avec la distance)
                // Plus tu es loin, moins c'est fort
                const maxDistance = 5000 // Distance max d'influence
                const strength = Math.max(0, 1 - (distance / maxDistance))

                const pullX = (e.clientX - logoX) * 0.02 * strength // Réduit la force

                gsap.to(logo, {
                    x: pullX,
                    duration: 0.5,
                    ease: 'power2.out'
                })
            })
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            logoElements.forEach((logo) => stopLevitation(logo as HTMLElement))
        }
    }, [mounted])

    if (!mounted) return null

    return (
        <div
            ref={containerRef}
            className="absolute inset-0"
            style={{ zIndex: 30 }}
        >
            {logos.map((logo, index) => (
                <div
                    key={logo.name}
                    className="tech-logo absolute cursor-pointer"
                    style={{
                        ...positions[index],
                        width: 'clamp(60px, 10vw, 120px)',
                        height: 'clamp(60px, 10vw, 120px)',
                    }}
                    onMouseEnter={(e) => {
                        console.log('HOVER !', logo.name)


                        // Marquer comme hovered
                        e.currentTarget.classList.add('hovered')

                        // Arrêter lévitation
                        stopLevitation(e.currentTarget)

                        // Scale up
                        gsap.to(e.currentTarget, {
                            scale: 1.4,
                            duration: 0.3,
                            ease: 'back.out',
                            overwrite: true
                        })

                        // Couleurs
                        const img = e.currentTarget.querySelector('img') as HTMLImageElement
                        if (img) {
                            img.style.filter = 'none'
                        }

                        e.currentTarget.style.filter = `drop-shadow(0 0 30px ${logo.color}) drop-shadow(0 0 50px ${logo.color})`
                    }}
                    onMouseLeave={(e) => {
                        console.log('LEAVE !', logo.name)

                        // STOCKER la référence AVANT l'animation
                        const logoElement = e.currentTarget

                        // Retirer le marqueur hovered
                        logoElement.classList.remove('hovered')

                        // Reset scale et X seulement
                        gsap.to(logoElement, {
                            scale: 1,
                            x: 0,
                            duration: 0.3,
                            ease: 'back.in',
                            onComplete: () => {
                                // Utiliser la référence stockée
                                startLevitation(logoElement)
                            }
                        })

                        // Retour blanc
                        const img = logoElement.querySelector('img') as HTMLImageElement
                        if (img) {
                            img.style.filter = 'brightness(0) invert(1)'
                        }

                        logoElement.style.filter = 'none'
                    }}
                >
                    <img
                        src={logo.svg}
                        alt={logo.name}
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'brightness(0) invert(1)',
                            transition: 'filter 0.3s ease',
                        }}
                    />
                </div>
            ))}
        </div>
    )
}