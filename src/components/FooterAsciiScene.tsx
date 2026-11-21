import { useEffect, useRef } from 'react';
import type { ThemeMode } from '../data/portfolio';

interface FooterAsciiSceneProps {
  src: string;
  theme: ThemeMode;
}

interface AsciiParticle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tone: number;
  darkChar: string;
  lightChar: string;
  altChar: string;
  darkAlpha: number;
  lightAlpha: number;
}

const IMAGE_ASPECT = 297 / 720;
const DARK_RAMP = ['.', ':', '-', '=', '+', '*', '#', '%', '@'];
const LIGHT_RAMP = ['@', '%', '#', '*', '+', '=', '-', ':', '.'];
const SCRAMBLE_CHARS = ['/', '\\', '+', '=', '*', ':'];
const ALPHA_BUCKETS = 12;

export function FooterAsciiScene({ src, theme }: FooterAsciiSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<ThemeMode>(theme);

  useEffect(() => {
    themeRef.current = theme;
    window.dispatchEvent(new CustomEvent('footer-ascii-redraw'));
  }, [theme]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: AsciiParticle[] = [];
    let loadedImg: HTMLImageElement | null = null;
    let width = 0;
    let visibleHeight = 0;
    let cellSize = 8.8;
    let dpr = 1;
    let rafId = 0;
    let prevPointer: { x: number; y: number } | null = null;
    let cancelled = false;
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    const reserveLayout = () => {
      width = Math.max(wrap.clientWidth, 320);
      cellSize = width < 560 ? 5.2 : width < 960 ? 7.2 : 8.8;
      const topHeadroom = Math.round(cellSize * 2.8);
      const drawH = Math.round(width * IMAGE_ASPECT);
      visibleHeight = topHeadroom + drawH;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(visibleHeight * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${visibleHeight}px`;
      wrap.style.height = `${visibleHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { topHeadroom, drawH };
    };

    const buildParticles = () => {
      const { topHeadroom, drawH } = reserveLayout();
      if (!loadedImg || loadedImg.naturalWidth === 0) {
        particles = [];
        return;
      }

      const off = document.createElement('canvas');
      const offCtx = off.getContext('2d');
      if (!offCtx) return;

      const offW = Math.ceil(width);
      const offH = Math.ceil(drawH);
      off.width = offW;
      off.height = offH;
      offCtx.clearRect(0, 0, offW, offH);
      offCtx.drawImage(loadedImg, 0, 0, offW, offH);

      const data = offCtx.getImageData(0, 0, offW, offH).data;
      const stepX = cellSize * 0.78;
      const stepY = cellSize * 1.02;

      const samples: Array<{ x: number; y: number; lum: number }> = [];
      let minLum = 1;
      let maxLum = 0;

      for (let relY = stepY * 0.5; relY < offH; relY += stepY) {
        const cy = Math.min(Math.floor(relY), offH - 1);
        for (let x = stepX * 0.5; x < offW; x += stepX) {
          const cx = Math.min(Math.floor(x), offW - 1);

          // Sample a small 2x2 neighborhood so fine mountain ridges and wildflowers stay crisp.
          let lumSum = 0;
          let count = 0;
          for (let oy = 0; oy <= 1; oy++) {
            const sy = Math.min(cy + oy, offH - 1);
            for (let ox = 0; ox <= 1; ox++) {
              const sx = Math.min(cx + ox, offW - 1);
              const offset = (sy * offW + sx) * 4;
              const a = data[offset + 3];
              if (a > 110) {
                const l =
                  (0.299 * data[offset] +
                    0.587 * data[offset + 1] +
                    0.114 * data[offset + 2]) /
                  255;
                lumSum += l;
                count += 1;
              }
            }
          }

          if (count >= 2) {
            const avgLum = lumSum / count;
            if (avgLum < minLum) minLum = avgLum;
            if (avgLum > maxLum) maxLum = avgLum;
            samples.push({ x, y: topHeadroom + relY, lum: avgLum });
          }
        }
      }

      const range = Math.max(maxLum - minLum, 0.15);
      const nextParticles: AsciiParticle[] = new Array(samples.length);

      for (let i = 0; i < samples.length; i++) {
        const s = samples[i];
        const normalized = Math.max(0, Math.min(1, (s.lum - minLum) / range));
        // Gentle S-curve keeps dark pine forests legible while letting peaks and flowers pop.
        const tone = Math.pow(normalized, 0.92);

        const darkIdx = Math.min(
          DARK_RAMP.length - 1,
          Math.floor(tone * DARK_RAMP.length)
        );
        const lightIdx = Math.min(
          LIGHT_RAMP.length - 1,
          Math.floor(tone * LIGHT_RAMP.length)
        );

        nextParticles[i] = {
          homeX: s.x,
          homeY: s.y,
          x: s.x,
          y: s.y,
          vx: 0,
          vy: 0,
          tone,
          darkChar: DARK_RAMP[darkIdx],
          lightChar: LIGHT_RAMP[lightIdx],
          altChar: SCRAMBLE_CHARS[i % SCRAMBLE_CHARS.length],
          darkAlpha: 0.28 + tone * 0.72,
          lightAlpha: 0.24 + (1 - tone) * 0.72
        };
      }

      // Grouping particles by tone minimizes Canvas fillStyle state switches per frame.
      nextParticles.sort((a, b) => a.tone - b.tone);
      particles = nextParticles;
    };

    const drawFrame = () => {
      rafId = 0;
      ctx.clearRect(0, 0, width, visibleHeight);
      if (particles.length === 0) return;

      const isDark = themeRef.current === 'dark';
      const [r, g, b] = isDark ? [243, 242, 236] : [17, 17, 16];
      const bucketStyles: string[] = new Array(ALPHA_BUCKETS + 1);
      for (let k = 0; k <= ALPHA_BUCKETS; k++) {
        const a = (k / ALPHA_BUCKETS).toFixed(3);
        bucketStyles[k] = `rgba(${r}, ${g}, ${b}, ${a})`;
      }

      const hitRadius = width < 560 ? 58 : 96;
      const spring = 0.11;
      const damping = 0.76;
      let moving = false;
      let lastBucket = -1;

      ctx.font = `600 ${Math.round(cellSize * 1.04)}px "IBM Plex Mono", ui-monospace, monospace`;
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

        const baseChar = isDark ? p.darkChar : p.lightChar;
        const baseAlpha = isDark ? p.darkAlpha : p.lightAlpha;
        const glyph = disp > 6 ? p.altChar : baseChar;
        const opacity = Math.min(1, baseAlpha + Math.min(disp / 24, 0.25));
        const bucket = Math.round(opacity * ALPHA_BUCKETS);

        if (bucket !== lastBucket) {
          ctx.fillStyle = bucketStyles[bucket];
          lastBucket = bucket;
        }
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
      const inBounds =
        lx >= -80 && lx <= rect.width + 80 && ly >= -80 && ly <= rect.height + 80;

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

    reserveLayout();

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      loadedImg = img;
      buildParticles();
      scheduleFrame();
    };
    img.src = src;

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('footer-ascii-redraw', scheduleFrame);

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('footer-ascii-redraw', scheduleFrame);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className="footer-ascii-wrap" aria-hidden="true">
      <canvas ref={canvasRef} id="footer-ascii" className="footer-ascii-canvas" />
    </div>
  );
}
