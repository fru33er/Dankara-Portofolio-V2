import type { LocaleContent, ThemeMode } from '../data/portfolio';
import { FooterAsciiScene } from './FooterAsciiScene';
import { Magnetic } from './Magnetic';
import { RollText } from './RollText';

interface FooterProps {
  content: LocaleContent;
  theme: ThemeMode;
}

export function Footer({ content, theme }: FooterProps) {
  const handleBackToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const wordmark = document.getElementById('wordmark-link');
    wordmark?.focus({ preventScroll: true });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a href="#top" className="wordmark roll-trigger">
            <img
              src="/dankara.svg"
              alt=""
              width={26}
              height={26}
              className="brand-logo"
              aria-hidden="true"
            />
            <RollText text={content.brand.wordmark} />
          </a>

          <nav className="footer-nav" aria-label={content.ui.footerNavLabel}>
            {content.ui.navItems.map((item) => (
              <a key={item.id} href={item.href} className="nav-link roll-trigger">
                <RollText text={item.label} />
              </a>
            ))}
          </nav>

          <Magnetic strength={6}>
            <button
              type="button"
              id="back-to-top"
              className="btn btn-secondary roll-trigger"
              data-cursor-label={content.ui.cursorTop}
              onClick={handleBackToTop}
            >
              <RollText text={content.ui.backToTop} />
              <span aria-hidden="true">↑</span>
            </button>
          </Magnetic>
        </div>

        <div className="footer-bottom">
          <p>{content.brand.copyright}</p>
          <p className="mono-index">{content.ui.footerEditHint}</p>
        </div>
      </div>

      <div className="container footer-ascii-container">
        <FooterAsciiScene src="/images/foto-footer-cutout.webp" theme={theme} />
      </div>
    </footer>
  );
}
