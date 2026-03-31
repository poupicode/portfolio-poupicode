'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Project } from './projectsData';
import { useTheme } from '../theme/ThemeProvider';

interface ProjectModalProps {
  project: Project;
  fromRect: DOMRect;
  onClose: () => void;
}

export default function ProjectModal({ project, fromRect, onClose }: ProjectModalProps) {
  const { theme } = useTheme();
  const modalBg = theme === 'dark' ? project.bgColor : project.bgColorLight;
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    const modal = modalRef.current;
    const content = contentRef.current;
    const backdrop = backdropRef.current;
    if (!modal || !content || !backdrop) return;

    const isMobile = 'ontouchstart' in window;
    const expandDur = isMobile ? 0.25 : 0.55;
    const contentDelay = isMobile ? 0.15 : 0.4;

    const scaleX = fromRect.width / window.innerWidth;
    const scaleY = fromRect.height / window.innerHeight;
    const x = fromRect.left + fromRect.width / 2 - window.innerWidth / 2;
    const y = fromRect.top + fromRect.height / 2 - window.innerHeight / 2;

    const tl = gsap.timeline();

    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: expandDur * 0.7, ease: 'power2.out' }, 0);

    tl.fromTo(
      modal,
      { scaleX, scaleY, x, y, borderRadius: '16px' },
      { scaleX: 1, scaleY: 1, x: 0, y: 0, borderRadius: '0px', duration: expandDur, ease: 'power3.inOut' },
      0
    );

    tl.fromTo(
      content,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: isMobile ? 0.2 : 0.4, ease: 'power2.out' },
      contentDelay
    );
  }, [fromRect]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const modal = modalRef.current;
    const content = contentRef.current;
    const backdrop = backdropRef.current;
    const closeBtn = closeBtnRef.current;
    if (!modal || !content || !backdrop) return;

    const scaleX = fromRect.width / window.innerWidth;
    const scaleY = fromRect.height / window.innerHeight;
    const x = fromRect.left + fromRect.width / 2 - window.innerWidth / 2;
    const y = fromRect.top + fromRect.height / 2 - window.innerHeight / 2;

    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(content, { opacity: 0, y: 16, duration: 0.2, ease: 'power2.in' }, 0);
    if (closeBtn) tl.to(closeBtn, { opacity: 0, scale: 0.8, duration: 0.15 }, 0);

    tl.to(
      modal,
      { scaleX, scaleY, x, y, borderRadius: '16px', duration: 0.5, ease: 'power3.inOut' },
      0.1
    );

    tl.to(backdrop, { opacity: 0, duration: 0.3 }, 0.25);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop blur */}
      <div
        ref={backdropRef}
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
        onClick={handleClose}
      />

      {/* Modal panel — click sur les bords = ferme */}
      <div
        ref={modalRef}
        className="absolute inset-0"
        style={{
          backgroundColor: modalBg,
          transformOrigin: 'center center',
          borderRadius: '16px',
        }}
        onClick={handleClose}
      >
        {/* Ambient glow top */}
        <div
          className="absolute inset-x-0 top-0 h-64 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top center, ${project.accentColor}12 0%, transparent 70%)`,
          }}
        />

        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={handleClose}
          className="fixed top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full border text-sm transition-all duration-200 hover:scale-110 hover:rotate-90"
          style={{
            borderColor: `${project.accentColor}60`,
            color: theme === 'dark' ? project.accentColor : 'var(--foreground)',
            backgroundColor: `${project.accentColor}12`,
            boxShadow: `0 0 18px ${project.accentColor}30`,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className="h-full overflow-y-auto"
        >
          {/* stopPropagation sur la colonne de contenu : les bords restent cliquables */}
          <div
            className="max-w-3xl mx-auto px-8 py-20 md:py-24"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-xs uppercase tracking-widest mb-5"
              style={{
                color: theme === 'dark' ? project.accentColor : 'var(--color-text-secondary)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {project.subtitle}
            </p>

            <h2
              className="font-bold mb-10"
              style={{
                fontSize: 'clamp(2.5rem, 10dvw, 6rem)',
                letterSpacing: '0.03em',
                color: 'var(--foreground)',
                overflowWrap: 'break-word',
              }}
            >
              {project.title}
            </h2>

            {/* Image placeholder */}
            <div
              className="w-full h-56 md:h-80 rounded-2xl mb-10 flex items-center justify-center"
              style={{
                border: `1px solid ${project.accentColor}30`,
                backgroundColor: `${project.accentColor}08`,
              }}
            >
              <p
                className="text-sm"
                style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--muted)' }}
              >
                Image — à venir
              </p>
            </div>

            {/* Description */}
            <p
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--color-text-secondary)' }}
            >
              {project.longDescription}
            </p>

            {/* Stack */}
            <div className="mb-10">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{
                  color: theme === 'dark' ? project.accentColor : 'var(--color-text-secondary)',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Stack technique
              </p>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full text-sm border"
                    style={{
                      borderColor: `${project.accentColor}55`,
                      color: theme === 'dark' ? project.accentColor : 'var(--foreground)',
                      backgroundColor: `${project.accentColor}15`,
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:brightness-110"
                style={{
                  backgroundColor: project.accentColor,
                  color: '#000',
                  boxShadow: `0 0 32px ${project.accentColor}50`,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Voir le projet →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
