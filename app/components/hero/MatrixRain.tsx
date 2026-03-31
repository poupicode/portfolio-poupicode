'use client'
import { useEffect, useRef } from 'react'
import codeSnippets from '../../data/code-snippets.json'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Sizing du canvas
        const setCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // Fix mobile : forcer la vraie hauteur viewport
            if (window.innerHeight < window.innerWidth) return // Desktop
            canvas.height = Math.max(window.innerHeight, document.documentElement.clientHeight)
        }
        setCanvasSize()
        window.addEventListener('resize', setCanvasSize)

        // IntersectionObserver : arrêter les nouvelles drops quand le hero sort du viewport
        let heroVisible = true
        const visibilityObserver = new IntersectionObserver(
            ([entry]) => { heroVisible = entry.isIntersecting },
            { threshold: 0.05 }
        )
        visibilityObserver.observe(canvas)

        // Palettes selon le thème
        const colorsDark = [
            '#00ffff',   // Cyan néon
            '#9d4edd',   // Violet électrique
            '#ff0080',   // Rose flash
            '#39ff14',   // Vert radioactif
            '#bf00ff',   // Violet fluo
        ]
        const colorsLight = [
            '#007799',   // Cyan sombre — 6:1 contrast sur fond clair
            '#6b1faf',   // Violet profond
            '#bb0044',   // Carmin
            '#1a7a00',   // Vert forêt
            '#880099',   // Violet foncé
        ]
        const isLightTheme = () =>
            document.documentElement.getAttribute('data-theme') === 'light' ||
            (!document.documentElement.getAttribute('data-theme') &&
                window.matchMedia('(prefers-color-scheme: light)').matches)

        const colorsRef = { current: isLightTheme() ? colorsLight : colorsDark }

        // Structure pour chaque ligne qui tombe
        interface Drop {
            x: number
            y: number
            text: string
            speed: number
            color: string
            revealedLetters: number
            fontSize: number
        }

        const drops: Drop[] = []
        let frameCount = 0

        // Fonction pour créer une nouvelle drop
        const createDrop = () => {
            const command = codeSnippets.commands[Math.floor(Math.random() * codeSnippets.commands.length)]
            const randomFontSize = Math.floor(Math.random() * 10) + 8 // Entre 8px et 18px

            return {
                x: Math.random() * (canvas.width - 200),
                y: -command.length * randomFontSize,
                text: command,
                speed: Math.random() * 1 + 0.5,
                color: colorsRef.current[Math.floor(Math.random() * colorsRef.current.length)],
                revealedLetters: 0,
                fontSize: randomFontSize
            }
        }

        // Créer quelques drops initiales
        const nbInitial = 4
        for (let i = 0; i < nbInitial; i++) {
            drops.push(createDrop())
        }

        // Animation loop
        const draw = () => {
            frameCount++

            // Clear complet
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Dessiner chaque drop
            for (let i = drops.length - 1; i >= 0; i--) {
                const drop = drops[i]
                const command = drop.text

                // Définir la font pour cette drop
                ctx.font = `${drop.fontSize}px "Courier New", monospace`

                // Révéler progressivement les lettres
                if (frameCount % 3 === 0 && drop.revealedLetters < command.length) {
                    drop.revealedLetters++
                }

                // Dessiner UNIQUEMENT les lettres révélées (EN PARTANT DU BAS)
                const startIndex = Math.max(0, command.length - drop.revealedLetters)
                for (let j = startIndex; j < command.length; j++) {
                    const letterX = drop.x
                    const letterY = drop.y + (j * drop.fontSize)

                    // Ne dessiner que si visible à l'écran
                    if (letterY > -drop.fontSize && letterY < canvas.height) {
                        // Gradient : fade en haut, lumineux en bas
                        const brightness = 0.2 + (j / command.length) * 0.8

                        ctx.shadowBlur = 10
                        ctx.shadowColor = drop.color

                        const hexColor = drop.color
                        const r = parseInt(hexColor.slice(1, 3), 16)
                        const g = parseInt(hexColor.slice(3, 5), 16)
                        const b = parseInt(hexColor.slice(5, 7), 16)
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`
                        ctx.fillText(command[command.length - 1 - j], letterX, letterY)
                    }
                }

                // Reset shadow
                ctx.shadowBlur = 0

                // Faire tomber
                drop.y += drop.speed

                // Si sort de l'écran, la supprimer
                if (drop.y > canvas.height + 50) {
                    drops.splice(i, 1)
                }
            }

            // FLUX CONSTANT — uniquement si le hero est visible
            if (frameCount % 50 === 0 && heroVisible) {
                if (drops.length < 15) {
                    drops.push(createDrop())
                }
            }

            // Garantir un minimum de drops actives
            if (drops.length < 6 && heroVisible) {
                drops.push(createDrop())
            }
        }

        // Animation à 60 FPS
        const interval = setInterval(draw, 1000 / 60)

        // Switcher la palette quand le thème change
        const themeObserver = new MutationObserver(() => {
            colorsRef.current = isLightTheme() ? colorsLight : colorsDark
            drops.forEach(drop => {
                drop.color = colorsRef.current[Math.floor(Math.random() * colorsRef.current.length)]
            })
        })
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        })

        // Cleanup
        return () => {
            clearInterval(interval)
            themeObserver.disconnect()
            visibilityObserver.disconnect()
            window.removeEventListener('resize', setCanvasSize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10"
            style={{ pointerEvents: 'none' }}
        />
    )
}