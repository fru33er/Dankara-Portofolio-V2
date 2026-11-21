import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import type { LocaleContent, LocaleKey, ThemeMode } from '../data/portfolio';
import { Magnetic } from './Magnetic';
import { RollText } from './RollText';

interface HeaderProps {
  content: LocaleContent;
  lang: LocaleKey;
  theme: ThemeMode;
  activeSection: string;
  mobileOpen: boolean;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
}

export function Header({
  content,
  lang,
  theme,
  activeSection,
  mobileOpen,
  onToggleLang,
  onToggleTheme,
  onOpenMobile,
  onCloseMobile
}: HeaderProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 32, restDelta: 0.001 });

  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (mobileOpen) {
      wasOpenRef.current = true;
      closeBtnRef.current?.focus();
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      menuToggleRef.current?.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMobile();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const isDark = theme === 'dark';

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />

      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" id="wordmark-link" className="wordmark roll-trigger">
            <img
              src="/dankara.svg"
              alt=""
              width={28}
              height={28}
              className="brand-logo"
              aria-hidden="true"
            />
            <RollText text={content.brand.wordmark} />
          </a>

          <nav id="primary-nav" className="primary-nav" aria-label={content.ui.navLabel}>
            {content.ui.navItems.map((item) => {
              const isCurrent = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="nav-link roll-trigger"
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <span className="mono-index" aria-hidden="true">
                    {item.index}
                  </span>
                  <RollText text={item.label} />
                  {isCurrent && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="nav-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="header-controls">
            <button
              type="button"
              id="lang-toggle"
              className="lang-toggle"
              aria-label={content.ui.langToggleLabel}
              onClick={onToggleLang}
            >
              {(['en', 'id'] as const).map((code) => {
                const active = lang === code;
                return (
                  <span key={code} className={`lang-option${active ? ' is-active' : ''}`}>
                    {active && (
                      <motion.span
                        layoutId="lang-pill"
                        className="lang-pill"
                        transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                      />
                    )}
                    {code.toUpperCase()}
                  </span>
                );
              })}
            </button>

            <Magnetic strength={5}>
              <button
                type="button"
                id="theme-toggle"
                className="theme-toggle"
                aria-pressed={isDark}
                aria-label={isDark ? content.ui.themeToLight : content.ui.themeToDark}
                onClick={onToggleTheme}
              >
                <motion.span
                  key={theme}
                  initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  aria-hidden="true"
                >
                  {isDark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                      <circle cx="12" cy="12" r="4" />
                      <line x1="12" y1="2" x2="12" y2="5" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="5" y2="12" />
                      <line x1="19" y1="12" x2="22" y2="12" />
                      <line x1="4.9" y1="4.9" x2="7" y2="7" />
                      <line x1="17" y1="17" x2="19.1" y2="19.1" />
                      <line x1="19.1" y1="4.9" x2="17" y2="7" />
                      <line x1="7" y1="17" x2="4.9" y2="19.1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                    </svg>
                  )}
                </motion.span>
                <span className="theme-label">
                  {isDark ? content.ui.themeLightLabel : content.ui.themeDarkLabel}
                </span>
              </button>
            </Magnetic>

            <button
              ref={menuToggleRef}
              type="button"
              id="menu-toggle"
              className="menu-toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              aria-label={content.ui.menuOpen}
              onClick={onOpenMobile}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              ref={drawerRef}
              id="mobile-drawer"
              className="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-drawer-title"
              initial={{ x: '100%' }}
              animate={{
                x: 0,
                transition: { type: 'spring', stiffness: 360, damping: 34 }
              }}
              exit={{
                x: '100%',
                transition: { duration: 0.18 }
              }}
            >
              <div className="mobile-drawer-head">
                <h2 id="mobile-drawer-title" className="mono-index">
                  {content.ui.menuTitle}
                </h2>
                <button
                  ref={closeBtnRef}
                  type="button"
                  id="menu-close"
                  className="dialog-close"
                  aria-label={content.ui.menuClose}
                  onClick={onCloseMobile}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18" aria-hidden="true">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>
              <nav className="mobile-drawer-links" aria-label={content.ui.mobileNavLabel}>
                {content.ui.navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="mobile-drawer-link"
                    onClick={onCloseMobile}
                  >
                    <span>{item.label}</span>
                    <span className="mono-index" aria-hidden="true">
                      {item.index}
                    </span>
                  </a>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
