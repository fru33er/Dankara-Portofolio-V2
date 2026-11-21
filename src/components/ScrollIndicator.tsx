import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface ScrollIndicatorProps {
  label: string;
}

export function ScrollIndicator({ label }: ScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001
  });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPct(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <motion.div
      id="floating-scroll"
      className="floating-scroll"
      aria-hidden="true"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="floating-scroll-row">
        <span className="floating-scroll-label">{label}</span>
        <span className="floating-scroll-value">{String(pct).padStart(3, '0')}%</span>
      </div>
      <div className="floating-scroll-track">
        <motion.div className="floating-scroll-fill" style={{ scaleX: smoothProgress }} />
      </div>
    </motion.div>
  );
}
