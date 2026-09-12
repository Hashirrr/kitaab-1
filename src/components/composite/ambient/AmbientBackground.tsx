'use client';

import { useEffect, useRef } from 'react';
import styles from './ambient.module.css';
import { Mode } from '@/constants/enums';
import { useAppSelector } from '@/store/hooks';
import { selectMode } from '@/store/slices/selectors';

interface Particle {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mode = useAppSelector(selectMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const isDark = mode === Mode.dark;

    // Vivid, luminous similar-tone particles in the Indigo / Sky / Cyan family
    const particleColors = isDark
      ? ['#818cf8', '#38bdf8', '#a78bfa', '#60a5fa', '#22d3ee', '#c084fc']
      : ['#6366f1', '#0ea5e9', '#8b5cf6', '#3b82f6', '#06b6d4', '#4f46e5'];

    const lineBaseColor = isDark ? '129, 140, 248' : '99, 102, 241';

    // Mouse tracking for dynamic constellation lines and smooth interaction
    const mouse = {
      x: -2000,
      y: -2000,
      radius: 170,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -2000;
      mouse.y = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      // Vibrant particle density across the screen
      const count = Math.min(Math.floor((width * height) / 14000), 90);

      for (let i = 0; i < count; i++) {
        const baseRadius = Math.random() * 2.2 + 1.2;
        const baseAlpha = isDark ? Math.random() * 0.45 + 0.45 : Math.random() * 0.4 + 0.4;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius,
          radius: baseRadius,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          color,
          alpha: baseAlpha,
          baseAlpha,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.02 + 0.008,
        });
      }
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isRunning = true;
        render();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const connectionDistance = 125;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // Draw constellation connections between close particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineOpacity = (1 - dist / connectionDistance) * (isDark ? 0.22 : 0.16);
            ctx.strokeStyle = `rgba(${lineBaseColor}, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw interactive connection line between cursor and nearby particles
        const mdx = mouse.x - p1.x;
        const mdy = mouse.y - p1.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius) {
          const cursorLineOpacity = (1 - mDist / mouse.radius) * (isDark ? 0.35 : 0.25);
          ctx.strokeStyle = `rgba(${lineBaseColor}, ${cursorLineOpacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Gentle attraction/push
          const force = (1 - mDist / mouse.radius) * 0.6;
          p1.x -= (mdx / mDist) * force;
          p1.y -= (mdy / mDist) * force;
        }
      }

      // Update and draw particles with vibrant luminous glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.phase += p.phaseSpeed;
        p.alpha = Math.min(1, Math.max(0.2, p.baseAlpha + Math.sin(p.phase) * 0.25));

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isDark ? 10 : 6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mode]);

  return (
    <div className={styles.ambient__container} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orb__1}`} />
      <div className={`${styles.orb} ${styles.orb__2}`} />
      <div className={`${styles.orb} ${styles.orb__3}`} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
