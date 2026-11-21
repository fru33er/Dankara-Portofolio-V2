import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import {
  portfolioLocales,
  type LocaleKey,
  type ThemeMode
} from './data/portfolio';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { WorksSection } from './components/WorksSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { InteractiveCursor } from './components/InteractiveCursor';
import { InteractiveBackground } from './components/InteractiveBackground';
import { ScrollIndicator } from './components/ScrollIndicator';
import { SplashScreen } from './components/SplashScreen';

function getInitialTheme(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function getInitialLang(): LocaleKey {
  return document.documentElement.getAttribute('lang') === 'id' ? 'id' : 'en';
}

export function App() {
  const [lang, setLang] = useState<LocaleKey>(getInitialLang);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [activeSection, setActiveSection] = useState<string>('tentang');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const content = portfolioLocales[lang];

  const announce = useCallback((msg: string) => {
    setAnnouncement('');
    window.requestAnimationFrame(() => setAnnouncement(msg));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Ignore storage restrictions in private browsing
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.title = content.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', content.meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', content.meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', content.meta.description);
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'id' ? 'id_ID' : 'en_US');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', content.meta.title);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', content.meta.description);
    try {
      localStorage.setItem('portfolio-lang-v2', lang);
    } catch {
      // Ignore storage restrictions in private browsing
    }
  }, [lang, content.meta.description, content.meta.title]);

  useEffect(() => {
    const sectionIds = ['tentang', 'karya', 'kontak'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-32% 0px -52% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      announce(next === 'dark' ? content.ui.themeDarkLabel : content.ui.themeLightLabel);
      return next;
    });
  };

  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      announce(next === 'id' ? 'Bahasa diubah ke Indonesia' : 'Language switched to English');
      return next;
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-link">
        {content.ui.skipToMain}
      </a>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <InteractiveBackground theme={theme} />
      <InteractiveCursor />
      <SplashScreen />

      <Header
        content={content}
        lang={lang}
        theme={theme}
        activeSection={activeSection}
        mobileOpen={mobileOpen}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
        onOpenMobile={() => setMobileOpen(true)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main id="main-content" tabIndex={-1}>
        <Hero content={content} />
        <AboutSection content={content} />
        <WorksSection content={content} />
        <ContactSection content={content} onAnnounce={announce} />
      </main>

      <Footer content={content} theme={theme} />
      <ScrollIndicator label={content.ui.scrollLabel} />
    </MotionConfig>
  );
}
