'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        if (!containerRef.current) return

        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 30

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.top = '0'
        renderer.domElement.style.left = '0'
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'

        containerRef.current.appendChild(renderer.domElement)

        // Raycaster pour détecter le hover
        const raycaster = new THREE.Raycaster()
        raycaster.near = 0.1
        raycaster.far = 1000

        const gridSize = 16
        const spacing = 5
        const points: THREE.Mesh[] = []

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                // Sauter 60% des points
                if (Math.random() > 0.4) continue

                const geometry = new THREE.SphereGeometry(0.12, 8, 8)

                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0 // Invisible au départ
                })

                const sphere = new THREE.Mesh(geometry, material)

                sphere.position.x = (x - gridSize / 2) * spacing
                sphere.position.y = (y - gridSize / 2) * spacing
                sphere.position.z = Math.random() * 15 - 7.5

                sphere.userData = {
                    initialX: sphere.position.x,
                    initialY: sphere.position.y,
                    initialZ: sphere.position.z,
                    offsetX: Math.random() * Math.PI * 2,
                    offsetY: Math.random() * Math.PI * 2,
                    targetOpacity: 0.15,
                    currentOpacity: 0,
                    delay: Math.random() * 2,
                    appeared: false,
                    glowAdded: false,
                    glow: null
                }

                scene.add(sphere)
                points.push(sphere)
            }
        }

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            }
        }
        window.addEventListener('mousemove', handleMouseMove)

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        let time = 0
        const animate = () => {
            time += 0.016

            // Position de la souris en coordonnées 3D
            const mouse = new THREE.Vector2(mouseRef.current.x, mouseRef.current.y)
            raycaster.setFromCamera(mouse, camera)

            points.forEach((point) => {
                const userData = point.userData

                // Animation d'apparition progressive
                if (!userData.appeared) {
                    if (time > userData.delay) {
                        userData.currentOpacity += 0.01
                        if (userData.currentOpacity >= userData.targetOpacity) {
                            userData.currentOpacity = userData.targetOpacity
                            userData.appeared = true
                        }
                    }
                }

                // Flottement subtil
                point.position.x = userData.initialX + Math.sin(time * 0.3 + userData.offsetX) * 0.3
                point.position.y = userData.initialY + Math.cos(time * 0.3 + userData.offsetY) * 0.3
                point.position.z = userData.initialZ + Math.sin(time * 0.2) * 0.2

                // Calculer la distance 2D écran entre souris et point
                const vector = point.position.clone()
                vector.project(camera)

                const x = (vector.x * 0.5 + 0.5) * window.innerWidth
                const y = (-vector.y * 0.5 + 0.5) * window.innerHeight

                const mouseX = (mouseRef.current.x * 0.5 + 0.5) * window.innerWidth
                const mouseY = (-mouseRef.current.y * 0.5 + 0.5) * window.innerHeight

                const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2)

                const material = point.material as THREE.MeshBasicMaterial

                // Si distance < 80 pixels, hover (AJUSTE CE NOMBRE)
                const isHovered = distance < 80

                // Transitions smooth avec lerp
                if (isHovered) {
                    // Transition vers allumé
                    material.opacity += (0.9 - material.opacity) * 0.15
                    const targetScale = 2
                    point.scale.x += (targetScale - point.scale.x) * 0.15
                    point.scale.y += (targetScale - point.scale.y) * 0.15
                    point.scale.z += (targetScale - point.scale.z) * 0.15

                    // Créer le glow une seule fois
                    if (!userData.glowAdded) {
                        const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16)
                        const glowMaterial = new THREE.MeshBasicMaterial({
                            color: 0xffffff,
                            transparent: true,
                            opacity: 0,
                            side: THREE.BackSide
                        })
                        const glow = new THREE.Mesh(glowGeometry, glowMaterial)
                        point.add(glow)
                        userData.glowAdded = true
                        userData.glow = glow
                    }

                    // Animer le glow smooth
                    if (userData.glow) {
                        const glow = userData.glow as THREE.Mesh
                        const targetGlowScale = 1.2
                        glow.scale.x += (targetGlowScale - glow.scale.x) * 0.15
                        glow.scale.y += (targetGlowScale - glow.scale.y) * 0.15
                        glow.scale.z += (targetGlowScale - glow.scale.z) * 0.15

                        const glowMat = glow.material as THREE.MeshBasicMaterial
                        glowMat.opacity += (0.4 - glowMat.opacity) * 0.15
                    }
                } else {
                    // Transition vers éteint
                    material.opacity += (userData.currentOpacity - material.opacity) * 0.15
                    point.scale.x += (1 - point.scale.x) * 0.15
                    point.scale.y += (1 - point.scale.y) * 0.15
                    point.scale.z += (1 - point.scale.z) * 0.15

                    // Réduire le glow smooth
                    if (userData.glow) {
                        const glow = userData.glow as THREE.Mesh
                        glow.scale.x += (1 - glow.scale.x) * 0.15
                        glow.scale.y += (1 - glow.scale.y) * 0.15
                        glow.scale.z += (1 - glow.scale.z) * 0.15

                        const glowMat = glow.material as THREE.MeshBasicMaterial
                        glowMat.opacity += (0.1 - glowMat.opacity) * 0.15
                    }
                }
            })

            renderer.render(scene, camera)
        }

        renderer.setAnimationLoop(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)

            renderer.setAnimationLoop(null)

            points.forEach(point => {
                // Nettoyer le glow s'il existe
                if (point.userData.glow) {
                    const glow = point.userData.glow as THREE.Mesh
                    point.remove(glow)
                    glow.geometry.dispose()
                        ; (glow.material as THREE.Material).dispose()
                }
                scene.remove(point)
                point.geometry.dispose()
                    ; (point.material as THREE.Material).dispose()
            })

            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
            }

            renderer.dispose()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    )
}