import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface KineticNumeralProps {
  value: string;
}

export function KineticNumeral({ value }: KineticNumeralProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const x = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [20, -20]);

  return (
    <motion.span ref={ref} className="section-numeral" style={{ x }} aria-hidden="true">
      {value}
    </motion.span>
  );
}
