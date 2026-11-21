import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type CursorMode = 'default' | 'interactive' | 'text' | 'disabled';

const INTERACTIVE_SELECTOR =
  'a[href], button, [role="tab"], label[for], .capability-item, .work-ledger-item';
const TEXT_SELECTOR = 'input:not([type="checkbox"]):not([type="radio"]), textarea';

export function InteractiveCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [pressed, setPressed] = useState(false);

  // Inner dot binds directly to rawX/rawY for zero-latency click precision when native cursor is hidden.
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Outer stroke ring trails behind the inner dot with smooth spring delay.
  const ringX = useSpring(rawX, { stiffness: 140, damping: 20, mass: 0.8 });
  const ringY = useSpring(rawY, { stiffness: 140, damping: 20, mass: 0.8 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }

    document.documentElement.classList.add('has-custom-cursor');

    const resolveMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return 'default';
      if (target.closest(':disabled, [aria-disabled="true"]')) return 'disabled';
      if (target.closest(TEXT_SELECTOR)) return 'text';
      if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive';
      return 'default';
    };

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
      setMode(resolveMode(e.target));
    };

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => {
      setVisible(false);
      setMode('default');
      setPressed(false);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const isText = mode === 'text';
  const isInteractive = mode === 'interactive';
  const isDisabled = mode === 'disabled';

  const ringScale = pressed ? 0.82 : isInteractive ? 1.5 : isText ? 0.85 : 1;
  const ringOpacity = !visible ? 0 : isDisabled ? 0.3 : isText ? 0.45 : 1;
  const dotScale = pressed ? 1.25 : isInteractive ? 0.65 : isDisabled ? 0.55 : 1;

  return (
    <>
      <motion.div
        id="cursor-ring"
        className="cursor-ring"
        aria-hidden="true"
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: ringOpacity,
          scale: ringScale
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      />
      <motion.div
        id="cursor-dot"
        className={`cursor-dot${isText ? ' is-text' : ''}`}
        aria-hidden="true"
        style={{ x: rawX, y: rawY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: dotScale
        }}
        transition={{ type: 'spring', stiffness: 520, damping: 32 }}
      />
    </>
  );
}
