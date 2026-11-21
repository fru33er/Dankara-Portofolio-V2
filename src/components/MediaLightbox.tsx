import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectMediaItem } from '../data/portfolio';

interface MediaLightboxProps {
  isOpen: boolean;
  title: string;
  media: ProjectMediaItem[];
  index: number;
  onChangeIndex: (next: number) => void;
  onClose: () => void;
  labels: {
    close: string;
    prev: string;
    next: string;
  };
}

export function MediaLightbox({
  isOpen,
  title,
  media,
  index,
  onChangeIndex,
  onClose,
  labels
}: MediaLightboxProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const snapshotRef = useRef<{ title: string; media: ProjectMediaItem[]; index: number }>({
    title,
    media,
    index
  });

  if (isOpen && media.length > 0) {
    snapshotRef.current = { title, media, index };
  }

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      return () => {
        window.cancelAnimationFrame(raf1);
        window.cancelAnimationFrame(raf2);
      };
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
    }, 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (media.length > 1 && e.key === 'ArrowRight') {
        e.preventDefault();
        onChangeIndex((index + 1) % media.length);
      } else if (media.length > 1 && e.key === 'ArrowLeft') {
        e.preventDefault();
        onChangeIndex((index - 1 + media.length) % media.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, index, media.length, onChangeIndex, onClose]);

  if (!mounted) return null;

  const activeTitle = isOpen ? title : snapshotRef.current.title;
  const activeMedia = isOpen ? media : snapshotRef.current.media;
  const activeIdx = Math.min(
    isOpen ? index : snapshotRef.current.index,
    Math.max(activeMedia.length - 1, 0)
  );
  const current = activeMedia[activeIdx];
  if (!current || !current.src) return null;

  const hasMultiple = activeMedia.length > 1;

  return createPortal(
    <div
      id="media-lightbox"
      className={`lightbox-backdrop${visible ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={activeTitle}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`lightbox-frame${visible ? ' is-open' : ''}`}>
        <div className="lightbox-header">
          <div className="lightbox-title-group">
            <span className="lightbox-project-title">{activeTitle}</span>
            <span className="mono-index lightbox-caption">{current.caption}</span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            id="lightbox-close"
            className="lightbox-close-btn"
            aria-label={labels.close}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="15" height="15" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="lightbox-stage">
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="lightbox-img"
          />
        </div>

        {hasMultiple && (
          <div className="lightbox-footer">
            <div className="lightbox-dots" role="group" aria-label={activeTitle}>
              {activeMedia.map((item, idx) => {
                const selected = idx === activeIdx;
                return (
                  <button
                    key={item.placeholderCode + item.caption}
                    type="button"
                    className={`lightbox-index-btn${selected ? ' is-active' : ''}`}
                    aria-pressed={selected}
                    onClick={() => onChangeIndex(idx)}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </button>
                );
              })}
            </div>

            <div className="lightbox-nav-controls">
              <button
                type="button"
                id="lightbox-prev"
                className="lightbox-nav-btn"
                aria-label={labels.prev}
                onClick={() =>
                  onChangeIndex((activeIdx - 1 + activeMedia.length) % activeMedia.length)
                }
              >
                <span aria-hidden="true">←</span>
              </button>
              <span className="mono-index lightbox-counter">
                {String(activeIdx + 1).padStart(2, '0')} /{' '}
                {String(activeMedia.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                id="lightbox-next"
                className="lightbox-nav-btn"
                aria-label={labels.next}
                onClick={() => onChangeIndex((activeIdx + 1) % activeMedia.length)}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
