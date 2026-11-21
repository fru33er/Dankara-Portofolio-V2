import { useEffect, useRef } from 'react';
import type { ThemeMode } from '../data/portfolio';

interface InteractiveBackgroundProps {
  theme: ThemeMode;
}

interface CircleNode {
  x: number;
  y: number;
  energy: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

interface PulseWave {
  x: number;
  y: number;
  radius: number;
  strength: number;
}

export function InteractiveBackground({ theme }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRgbRef = useRef<[number, number, number]>(theme === 'dark' ? [243, 242, 236] : [17, 17, 16]);
  const baseAlphaRef = useRef(theme === 'dark' ? 0.12 : 0.1);
  const peakAlphaRef = useRef(theme === 'dark' ? 0.38 : 0.34);

  useEffect(() => {
    inkRgbRef.current = theme === 'dark' ? [243, 242, 236] : [17, 17, 16];
    baseAlphaRef.current = theme === 'dark' ? 0.12 : 0.1;
    peakAlphaRef.current = theme === 'dark' ? 0.38 : 0.34;
    window.dispatchEvent(new CustomEvent('interactive-bg-redraw'));
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const trail: TrailPoint[] = [];
    const pulses: PulseWave[] = [];
    let lastPoint: { x: number; y: number } | null = null;
    let nodes: CircleNode[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    const buildGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Spacious editorial spacing echoes the dual-circle cursor without crowding copy.
      const spacing = width < 640 ? 58 : 66;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) * 0.5;
      const offsetY = (height - (rows - 1) * spacing) * 0.5;

      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            x: offsetX + c * spacing,
            y: offsetY + r * spacing,
            energy: 0
          });
        }
      }
    };

    const drawFrame = () => {
      rafId = 0;
      ctx.clearRect(0, 0, width, height);

      const [r, g, b] = inkRgbRef.current;
      const baseAlpha = baseAlphaRef.current;
      const peakAlpha = peakAlphaRef.current;
      const traceRadius = width < 640 ? 115 : 155;
      let stillMoving = false;

      // Decay cursor trace points smoothly to form a trailing wake.
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life *= 0.92;
        if (trail[i].life < 0.03) {
          trail.splice(i, 1);
        } else {
          stillMoving = true;
        }
      }

      // Advance outward click impulse rings.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const wave = pulses[i];
        wave.radius += 11;
        wave.strength *= 0.94;
        if (wave.strength < 0.02 || wave.radius > Math.max(width, height) * 0.9) {
          pulses.splice(i, 1);
        } else {
          stillMoving = true;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        let targetEnergy = 0;

        for (let t = 0; t < trail.length; t++) {
          const pt = trail[t];
          const dx = pt.x - node.x;
          const dy = pt.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < traceRadius) {
            const falloff = 1 - dist / traceRadius;
            const localEnergy = falloff * falloff * pt.life;
            if (localEnergy > targetEnergy) {
              targetEnergy = localEnergy;
            }
          }
        }

        for (let p = 0; p < pulses.length; p++) {
          const wave = pulses[p];
          const wdist = Math.hypot(node.x - wave.x, node.y - wave.y);
          const band = Math.abs(wdist - wave.radius);
          if (band < 68) {
            const waveInfluence = (1 - band / 68) * wave.strength;
            if (waveInfluence > targetEnergy) {
              targetEnergy = Math.min(1, waveInfluence);
            }
          }
        }

        // Fast attack on pointer contact, slower release for a lingering trace wake.
        const rate = targetEnergy > node.energy ? 0.34 : 0.075;
        node.energy += (targetEnergy - node.energy) * rate;

        if (node.energy > 0.004 || targetEnergy > 0.004) {
          stillMoving = true;
        } else {
          node.energy = 0;
        }

        const radius = 1.6 + node.energy * 9.2;
        const alpha = baseAlpha + node.energy * (peakAlpha - baseAlpha);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1 + node.energy * 0.35;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (stillMoving) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const scheduleFrame = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const pushTrail = (x: number, y: number) => {
      if (lastPoint) {
        const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
        if (dist > 44) {
          const steps = Math.min(4, Math.floor(dist / 44));
          for (let s = 1; s < steps; s++) {
            const ratio = s / steps;
            trail.push({
              x: lastPoint.x + (x - lastPoint.x) * ratio,
              y: lastPoint.y + (y - lastPoint.y) * ratio,
              life: 0.92
            });
          }
        }
      }
      trail.push({ x, y, life: 1 });
      if (trail.length > 26) {
        trail.splice(0, trail.length - 26);
      }
      lastPoint = { x, y };
    };

    const handleMove = (e: PointerEvent) => {
      pushTrail(e.clientX, e.clientY);
      scheduleFrame();
    };

    const handleLeave = () => {
      lastPoint = null;
      scheduleFrame();
    };

    const handleDown = (e: PointerEvent) => {
      pushTrail(e.clientX, e.clientY);
      pulses.push({ x: e.clientX, y: e.clientY, radius: 12, strength: 1 });
      if (pulses.length > 4) pulses.shift();
      scheduleFrame();
    };

    const handleResize = () => {
      buildGrid();
      scheduleFrame();
    };

    buildGrid();
    scheduleFrame();

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('interactive-bg-redraw', scheduleFrame);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('interactive-bg-redraw', scheduleFrame);
    };
  }, []);

  return <canvas ref={canvasRef} id="interactive-bg" className="interactive-bg" aria-hidden="true" />;
}
