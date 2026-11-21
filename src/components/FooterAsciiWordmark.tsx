import { useEffect, useRef } from 'react';
import type { ThemeMode } from '../data/portfolio';

interface FooterAsciiWordmarkProps {
  text: string;
  theme: ThemeMode;
}

interface AsciiParticle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  altChar: string;
  alpha: number;
}

const ASCII_RAMP = ['#', '%', '+', '=', ':', '.'];
const SCRAMBLE_CHARS = ['/', '\\', '+', '=', '*', ':'];

export function FooterAsciiWordmark({ text, theme }: FooterAsciiWordmarkProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRgbRef = useRef<[number, number, number]>(
    theme === 'dark' ? [243, 242, 236] : [17, 17, 16]
  );

  useEffect(() => {
    inkRgbRef.current = theme === 'dark' ? [243, 242, 236] : [17, 17, 16];
    window.dispatchEvent(new CustomEvent('footer-ascii-redraw'));
  }, [theme]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const label = text.toUpperCase();
    let particles: AsciiParticle[] = [];
    let width = 0;
    let visibleHeight = 0;
    let cellSize = 10;
    let dpr = 1;
    let rafId = 0;
    let prevPointer: { x: number; y: number } | null = null;
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    const buildParticles = () => {
      width = Math.max(wrap.clientWidth, 320);
      cellSize = width < 560 ? 6 : width < 960 ? 8 : 9.5;

      const off = document.createElement('canvas');
      const offCtx = off.getContext('2d');
      if (!offCtx) return;

      const targetTextW = width * 0.96;
      const probeSize = 200;
      offCtx.font = `800 ${probeSize}px "Bricolage Grotesque", "Segoe UI", system-ui, sans-serif`;
      const measuredW = Math.max(offCtx.measureText(label).width, 1);
      const fontSize = Math.min(Math.max((targetTextW / measuredW) * probeSize, 56), 280);

      off.width = Math.ceil(width);
      off.height = Math.ceil(fontSize * 1.4);

      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.fillStyle = '#ffffff';
      offCtx.font = `800 ${fontSize}px "Bricolage Grotesque", "Segoe UI", system-ui, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'top';
      offCtx.fillText(label, off.width * 0.5, 16);

      const img = offCtx.getImageData(0, 0, off.width, off.height).data;

      // Measure actual rendered ink vertical bounds so the crop is an exact visual half-height.
      let minInkY = off.height;
      let maxInkY = 0;
      for (let y = 0; y < off.height; y += 2) {
        for (let x = 0; x < off.width; x += 4) {
          if (img[(y * off.width + x) * 4 + 3] > 60) {
            if (y < minInkY) minInkY = y;
            if (y > maxInkY) maxInkY = y;
          }
        }
      }

      const inkH = Math.max(maxInkY - minInkY, fontSize * 0.65);
      const topHeadroom = Math.round(cellSize * 2.4);
      const cropInkH = inkH * 0.58;
      visibleHeight = Math.round(topHeadroom + cropInkH);

      particles = [];
      const stepX = cellSize * 0.84;
      const stepY = cellSize * 1.06;
      let idx = 0;

      for (let relY = 0; relY < cropInkH + stepY; relY += stepY) {
        const srcY = Math.min(Math.floor(minInkY + relY), off.height - 1);
        const drawY = topHeadroom + relY;
        for (let x = 0; x < off.width; x += stepX) {
          const srcX = Math.min(Math.floor(x), off.width - 1);
          const alpha = img[(srcY * off.width + srcX) * 4 + 3] / 255;
          if (alpha > 0.22) {
            const rampIdx = Math.min(
              ASCII_RAMP.length - 1,
              Math.floor((1 - alpha) * ASCII_RAMP.length)
            );
            particles.push({
              homeX: x,
              homeY: drawY,
              x,
              y: drawY,
              vx: 0,
              vy: 0,
              char: ASCII_RAMP[rampIdx],
              altChar: SCRAMBLE_CHARS[idx % SCRAMBLE_CHARS.length],
              alpha: 0.48 + alpha * 0.52
            });
            idx += 1;
          }
        }
      }

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(visibleHeight * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${visibleHeight}px`;
      wrap.style.height = `${visibleHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = () => {
      rafId = 0;
      ctx.clearRect(0, 0, width, visibleHeight);

      const [r, g, b] = inkRgbRef.current;
      const hitRadius = width < 560 ? 58 : 96;
      const spring = 0.11;
      const damping = 0.76;
      let moving = false;

      ctx.font = `600 ${Math.round(cellSize * 1.05)}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < hitRadius && dist > 0.001) {
            const norm = 1 - dist / hitRadius;
            const push = norm * norm * 6.8;
            p.vx += (dx / dist) * push + pointer.vx * norm * 0.22;
            p.vy += (dy / dist) * push + pointer.vy * norm * 0.22;
          }
        }

        // Smooth spring force pulls bumped ASCII glyphs right back into formation.
        p.vx += (p.homeX - p.x) * spring;
        p.vy += (p.homeY - p.y) * spring;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        const disp = Math.hypot(p.homeX - p.x, p.homeY - p.y);
        const speed = Math.hypot(p.vx, p.vy);

        if (disp > 0.15 || speed > 0.08) {
          moving = true;
        } else {
          p.x = p.homeX;
          p.y = p.homeY;
          p.vx = 0;
          p.vy = 0;
        }

        const glyph = disp > 6 ? p.altChar : p.char;
        const opacity = Math.min(1, p.alpha + Math.min(disp / 24, 0.25));
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(3)})`;
        ctx.fillText(glyph, p.x, p.y);
      }

      pointer.vx *= 0.6;
      pointer.vy *= 0.6;

      if (moving) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const scheduleFrame = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      const inBounds = lx >= -80 && lx <= rect.width + 80 && ly >= -80 && ly <= rect.height + 80;

      if (!inBounds) {
        if (pointer.active) {
          pointer.active = false;
          prevPointer = null;
          scheduleFrame();
        }
        return;
      }

      if (prevPointer) {
        pointer.vx = Math.max(-24, Math.min(24, lx - prevPointer.x));
        pointer.vy = Math.max(-24, Math.min(24, ly - prevPointer.y));
      }
      pointer.x = lx;
      pointer.y = ly;
      pointer.active = true;
      prevPointer = { x: lx, y: ly };
      scheduleFrame();
    };

    const handleLeave = () => {
      pointer.active = false;
      prevPointer = null;
      scheduleFrame();
    };

    const handleResize = () => {
      buildParticles();
      scheduleFrame();
    };

    buildParticles();
    scheduleFrame();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        buildParticles();
        scheduleFrame();
      });
    }

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('footer-ascii-redraw', scheduleFrame);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('footer-ascii-redraw', scheduleFrame);
    };
  }, [text]);

  return (
    <div ref={wrapRef} className="footer-ascii-wrap" aria-hidden="true">
      <canvas ref={canvasRef} id="footer-ascii" className="footer-ascii-canvas" />
    </div>
  );
}
