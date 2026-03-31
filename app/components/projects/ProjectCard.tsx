'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Project } from './projectsData';
import { useTheme } from '../theme/ThemeProvider';

interface ProjectCardProps {
  project: Project;
  isModalOpen: boolean;
  onOpen: (project: Project, rect: DOMRect) => void;
}

export default function ProjectCard({ project, isModalOpen, onOpen }: ProjectCardProps) {
  const { theme } = useTheme();
  const cardBg = theme === 'dark' ? project.bgColor : project.bgColorLight;
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const progressRef = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const perimeterRef = useRef(0);
  const openedRef = useRef(false);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = 'ontouchstart' in window;
  }, []);

  // Calculate SVG perimeter after mount
  useEffect(() => {
    const card = cardRef.current;
    const rect = rectRef.current;
    const svg = svgRef.current;
    if (!card || !rect || !svg) return;

    const w = card.clientWidth;
    const h = card.clientHeight;
    const r = 16;
    const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;

    perimeterRef.current = perimeter;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    rect.setAttribute('width', String(w - 2));
    rect.setAttribute('height', String(h - 2));
    rect.style.strokeDasharray = String(perimeter);
    rect.style.strokeDashoffset = String(perimeter);
  }, []);

  // Reset border when modal closes
  useEffect(() => {
    if (!isModalOpen && openedRef.current) {
      openedRef.current = false;
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.to(progressRef.current, {
        value: 0,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (rectRef.current) {
            rectRef.current.style.strokeDashoffset = String(
              perimeterRef.current * (1 - progressRef.current.value)
            );
          }
        },
      });
    }
  }, [isModalOpen]);

  const handleMouseEnter = () => {
    if (openedRef.current || isTouchRef.current) return;
    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(progressRef.current, {
      value: 1,
      duration: 2,
      ease: 'none',
      onUpdate: () => {
        if (rectRef.current) {
          rectRef.current.style.strokeDashoffset = String(
            perimeterRef.current * (1 - progressRef.current.value)
          );
        }
      },
      onComplete: () => {
        openedRef.current = true;
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) onOpen(project, rect);
      },
    });
  };

  const handleMouseLeave = () => {
    if (openedRef.current || isTouchRef.current) return;
    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(progressRef.current, {
      value: 0,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (rectRef.current) {
          rectRef.current.style.strokeDashoffset = String(
            perimeterRef.current * (1 - progressRef.current.value)
          );
        }
      },
    });
  };

  const handleClick = () => {
    if (!isTouchRef.current) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) onOpen(project, rect);
  };

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0 rounded-2xl cursor-pointer no-select overflow-hidden"
      style={{
        backgroundColor: cardBg,
        width: 'clamp(240px, 78dvw, 300px)',
        aspectRatio: '5/7',
        transition: 'background-color 0.4s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Animated SVG border */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <rect
          ref={rectRef}
          x="1"
          y="1"
          rx="16"
          ry="16"
          fill="none"
          stroke={project.accentColor}
          strokeWidth="2"
        />
      </svg>

      {/* Subtle inner glow on accent */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${project.accentColor}08 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        <div
          className="w-8 h-[2px] rounded-full mb-5"
          style={{ backgroundColor: project.accentColor }}
        />

        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{
            color: theme === 'dark' ? project.accentColor : 'var(--color-text-secondary)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {project.subtitle}
        </p>

        <h3
          className="font-bold mb-4"
          style={{
            fontSize: 'clamp(1.3rem, 6dvw, 1.875rem)',
            letterSpacing: '0.05em',
            color: 'var(--foreground)',
            overflowWrap: 'break-word',
          }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--color-text-secondary)' }}
        >
          {project.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full border"
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
          {project.tags.length > 3 && (
            <span
              className="text-xs px-2 py-1"
              style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--muted)' }}
            >
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Hover hint — desktop only */}
        <p
          className="text-[11px] mt-3 text-center hidden md:block"
          style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--muted)' }}
        >
          Maintenir le survol pour ouvrir
        </p>
      </div>
    </div>
  );
}
