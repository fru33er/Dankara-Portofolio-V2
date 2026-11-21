import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'exit' | 'done'>('enter');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'done') {
      onComplete?.();
      return;
    }

    if (phase === 'exit') {
      const unmountTimer = window.setTimeout(() => {
        setPhase('done');
      }, 740);
      return () => window.clearTimeout(unmountTimer);
    }

    const duration = 2250;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    const exitTimer = window.setTimeout(() => {
      setPhase('exit');
    }, 2600);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhase('exit');
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  const pct = String(progress).padStart(3, '0');

  return (
    <div
      id="splash-screen"
      className={`splash-overlay${phase === 'exit' ? ' is-exiting' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="splash-corner-bar">
        <span className="mono-index">DANKARA.MY.ID</span>
        <button
          type="button"
          className="splash-skip-btn"
          onClick={() => setPhase('exit')}
          tabIndex={-1}
        >
          SKIP
        </button>
      </div>

      <div className="splash-center">
        <div className="splash-stage-3d">
          <div className="splash-orbit splash-orbit-outer" />
          <div className="splash-orbit splash-orbit-inner" />

          <div className="splash-prism">
            <div className="splash-face splash-face-front">
              <img
                src="/dankara.svg"
                alt=""
                width={72}
                height={72}
                className="splash-logo-img"
              />
            </div>
            <div className="splash-face splash-face-back">
              <img
                src="/dankara.svg"
                alt=""
                width={72}
                height={72}
                className="splash-logo-img"
              />
            </div>
            <div className="splash-face splash-face-right" />
            <div className="splash-face splash-face-left" />
            <div className="splash-face splash-face-top" />
            <div className="splash-face splash-face-bottom" />
          </div>
        </div>

        <div className="splash-wordmark-mask">
          <div className="splash-wordmark">Raka Andhika</div>
        </div>

        <p className="splash-role mono-index">SOFTWARE · WEB · VISUAL</p>
      </div>

      <div className="splash-footer-bar">
        <div className="splash-progress-meta">
          <span className="mono-index">INITIALIZING</span>
          <span className="mono-index splash-counter">{pct}%</span>
        </div>
        <div className="splash-progress-track">
          <div
            className="splash-progress-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
