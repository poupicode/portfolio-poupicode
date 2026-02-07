'use client'
import { useEffect, useRef } from 'react'
import codeSnippets from '../../data/code-snippets.json'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Sizing du canvas
        const setCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        setCanvasSize()
        window.addEventListener('resize', setCanvasSize)

        // Suivi de la souris
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current = {
                x: event.clientX,
                y: event.clientY
            }
        }
        window.addEventListener('mousemove', handleMouseMove)

        // Palette de couleurs FLUO INTENSES
        const colors = [
            '#00ffff',   // Cyan néon
            '#9d4edd',   // Violet électrique
            '#ff0080',   // Rose flash
            '#39ff14',   // Vert radioactif
            '#bf00ff',   // Violet fluo
        ]

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
                color: colors[Math.floor(Math.random() * colors.length)],
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
                        // Calculer distance avec la souris
                        const distanceToMouse = Math.sqrt(
                            (letterX - mouseRef.current.x) ** 2 +
                            (letterY - mouseRef.current.y) ** 2
                        )

                        // Zone de hover (100 pixels)
                        const hoverRadius = 100
                        const isHovered = distanceToMouse < hoverRadius

                        // Gradient : fade en haut, lumineux en bas
                        let brightness = 0.2 + (j / command.length) * 0.8

                        // Si hover, augmenter la luminosité
                        if (isHovered) {
                            const hoverIntensity = 1 - (distanceToMouse / hoverRadius)
                            brightness = 1

                            ctx.save()

                            // Scale up + rotation
                            ctx.translate(letterX, letterY)
                            const scale = 1 + (hoverIntensity * 0.5)
                            ctx.scale(scale, scale)
                            ctx.rotate(hoverIntensity * 0.2)

                            // Mega glow
                            ctx.fillStyle = drop.color
                            ctx.shadowBlur = 60
                            ctx.shadowColor = drop.color

                            // Dessiner au centre après transformation
                            ctx.fillText(command[command.length - 1 - j], 0, 0)

                            ctx.restore()
                        } else {
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

            // FLUX CONSTANT
            if (frameCount % 50 === 0) {
                if (drops.length < 15) {
                    drops.push(createDrop())
                }
            }

            // Garantir un minimum de drops actives
            if (drops.length < 6) {
                drops.push(createDrop())
            }
        }

        // Animation à 60 FPS
        const interval = setInterval(draw, 1000 / 60)

        // Cleanup
        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', setCanvasSize)
            window.removeEventListener('mousemove', handleMouseMove)
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