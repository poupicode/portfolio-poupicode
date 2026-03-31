'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { projects, Project } from './projectsData';

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalRect, setModalRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Desktop: GSAP horizontal scroll
  useEffect(() => {
    if (isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 96),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 96}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // Title fade-in on scroll (mobile only, desktop is always visible via pin)
  useEffect(() => {
    if (!isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  const handleOpen = (project: Project, rect: DOMRect) => {
    setModalRect(rect);
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    document.body.style.overflow = '';
    setSelectedProject(null);
    setModalRect(null);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative ${isMobile ? '' : 'h-screen overflow-hidden'}`}
        style={isMobile ? { padding: 'var(--space-section-y) 0' } : undefined}
      >
        {/* Section header */}
        <div
          ref={titleRef}
          className={isMobile ? 'mb-10' : 'absolute top-12 left-12 z-10'}
          style={isMobile ? { padding: '0 var(--space-x)' } : undefined}
        >
          <p
            className="uppercase tracking-widest mb-1"
            style={{ fontFamily: 'system-ui, sans-serif', fontSize: 'var(--text-label)', color: 'var(--muted)' }}
          >
            Portfolio
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: 'var(--text-section)', letterSpacing: '0.04em', color: 'var(--foreground)' }}
          >
            Projets
          </h2>
        </div>

        {/* Cards track */}
        {isMobile ? (
          // Mobile: CSS horizontal snap scroll
          <div
            ref={trackRef}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{
              gap: '3.333dvw',
              padding: '0 var(--space-x) 1rem',
              scrollbarWidth: 'none',
            }}
          >
            {projects.map((project) => (
              <div key={project.id} className="snap-center flex-shrink-0">
                <ProjectCard
                  project={project}
                  isModalOpen={selectedProject !== null}
                  onOpen={handleOpen}
                />
              </div>
            ))}
            <div className="flex-shrink-0" style={{ width: 'clamp(0.5rem, 3dvw, 1.5rem)' }} />
          </div>
        ) : (
          // Desktop: GSAP pinned horizontal
          <div
            ref={trackRef}
            className="flex items-center h-full"
            style={{
              gap: '2.778dvw',
              paddingLeft: '18.056dvw',
              paddingRight: 'var(--space-x)',
            }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isModalOpen={selectedProject !== null}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </section>

      {selectedProject && modalRect && (
        <ProjectModal
          project={selectedProject}
          fromRect={modalRect}
          onClose={handleClose}
        />
      )}
    </>
  );
}
