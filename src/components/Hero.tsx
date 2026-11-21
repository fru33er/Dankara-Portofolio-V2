import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { LocaleContent } from '../data/portfolio';
import { Magnetic } from './Magnetic';
import { RollText } from './RollText';

interface HeroProps {
  content: LocaleContent;
}

const expoEase = [0.16, 1, 0.3, 1] as const;

export function Hero({ content }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress: heroProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const headlineY = useTransform(heroProgress, [0, 1], reducedMotion ? [0, 0] : [0, 36]);

  const groupItems = [...content.hero.kineticStrip, ...content.hero.kineticStrip];

  return (
    <section ref={sectionRef} id="top" className="hero">
      <div className="container">
        <motion.div
          className="hero-top-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: expoEase }}
        >
          <span className="mono-index">{content.hero.status}</span>
        </motion.div>

        <motion.h1 className="hero-title" style={{ y: headlineY }}>
          <span className="mask-line">
            <motion.span
              style={{ display: 'block' }}
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.72, delay: 0.08, ease: expoEase }}
            >
              {content.hero.headline}
            </motion.span>
          </span>
          <span className="mask-line">
            <motion.span
              className="hero-title-role"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.72, delay: 0.18, ease: expoEase }}
            >
              {content.hero.role}
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: expoEase }}
        >
          <p className="hero-summary">{content.hero.summary}</p>

          <div className="hero-actions">
            <Magnetic strength={8}>
              <a
                href="#karya"
                id="hero-primary-cta"
                className="btn btn-primary roll-trigger"
                data-cursor-label={content.ui.cursorView}
              >
                <RollText text={content.hero.primaryCta} />
              </a>
            </Magnetic>

            <Magnetic strength={6}>
              <a href="#kontak" id="hero-secondary-cta" className="btn btn-secondary roll-trigger">
                <RollText text={content.hero.secondaryCta} />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>

      <div className="kinetic-band">
        <div className="kinetic-viewport">
          <div className="kinetic-track">
            <div className="kinetic-group">
              {groupItems.map((entry, idx) => (
                <span key={`a-${entry}-${idx}`} className="kinetic-chip">
                  <span>{entry}</span>
                  <span className="kinetic-sep" aria-hidden="true">/</span>
                </span>
              ))}
            </div>
            <div className="kinetic-group" aria-hidden="true">
              {groupItems.map((entry, idx) => (
                <span key={`b-${entry}-${idx}`} className="kinetic-chip">
                  <span>{entry}</span>
                  <span className="kinetic-sep">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
