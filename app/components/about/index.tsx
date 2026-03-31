'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });

      tl.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.7,
        ease: 'power3.out',
      });

      tl.from(
        headlineRef.current,
        {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      tl.from(
        paragraphRef.current,
        {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center"
      style={{ padding: 'var(--space-section-y) var(--space-x)' }}
    >
      <div style={{ maxWidth: '53.333dvw', minWidth: '280px', width: '100%' }}>
        {/* Accent line */}
        <div
          ref={lineRef}
          className="rounded-full mb-8"
          style={{ width: '2.778dvw', minWidth: '2rem', height: '2px', backgroundColor: 'var(--primary)' }}
        />

        {/* Headline */}
        <p
          ref={headlineRef}
          className="font-bold leading-tight mb-8"
          style={{ fontSize: 'var(--text-headline)', letterSpacing: '0.02em', color: 'var(--foreground)' }}
        >
          Je transforme idées, contraintes et technologies en expériences web{' '}
          <span style={{ color: 'var(--primary)' }}>élégantes</span>,{' '}
          <span style={{ color: 'var(--secondary)' }}>optimisées</span> et robustes.
        </p>

        {/* Paragraph */}
        <p
          ref={paragraphRef}
          className="leading-relaxed"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Développeur fullstack passionné, je conçois des applications web de bout en bout —
          de l'API au pixel. Mon approche mêle rigueur technique et sensibilité UX : chaque projet
          est une opportunité de livrer quelque chose de performant, maintenable et agréable à utiliser.
          Docker, React, PHP, Node.js... les outils sont au service de l'expérience, pas l'inverse.
        </p>
      </div>
    </section>
  );
}
