import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  portfolioConfig,
  type LocaleContent,
  type ProjectItem
} from '../data/portfolio';
import { KineticNumeral } from './KineticNumeral';

interface WorksSectionProps {
  content: LocaleContent;
}

const expoEase = [0.16, 1, 0.3, 1] as const;

export function WorksSection({ content }: WorksSectionProps) {
  const { works } = content;

  const [status, setStatus] = useState<'ready' | 'loading' | 'error'>(
    portfolioConfig.projectsEndpoint ? 'loading' : 'ready'
  );
  const [remoteItems, setRemoteItems] = useState<ProjectItem[] | null>(null);
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
  const [activeMediaIdx, setActiveMediaIdx] = useState<number>(0);

  const selectWork = useCallback((id: string | null) => {
    setActiveWorkId((prev) => {
      if (prev !== id) setActiveMediaIdx(0);
      return id;
    });
  }, []);

  const loadRemoteProjects = useCallback(async () => {
    if (!portfolioConfig.projectsEndpoint) {
      setStatus('ready');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch(portfolioConfig.projectsEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Invalid project array');
      setRemoteItems(json as ProjectItem[]);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (portfolioConfig.projectsEndpoint) {
      loadRemoteProjects();
    }
  }, [loadRemoteProjects]);

  const items = remoteItems ?? works.items;
  const activeWork = activeWorkId
    ? items.find((item) => item.id === activeWorkId) ?? null
    : null;
  const isSplit = Boolean(activeWork);

  return (
    <section id="karya" className="section section-works">
      <div className="container">
        <motion.div
          className="section-header-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: expoEase }}
        >
          <div className="section-kicker-group">
            <KineticNumeral value={works.index} />
            <h2 id="works-title" className="section-title">
              {works.title}
            </h2>
          </div>
          <span className="mono-index">{works.hoverHint}</span>
        </motion.div>

        <motion.hr
          className="rule-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.78, ease: expoEase }}
        />

        <div id="works-stage" aria-live="polite" aria-busy={status === 'loading'}>
          {status === 'loading' && (
            <div className="state-panel" style={{ marginTop: '1.75rem' }}>
              <h3 className="state-title">{works.loadingTitle}</h3>
              <p className="state-desc">{works.loadingDesc}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="state-panel state-panel-error" role="alert" style={{ marginTop: '1.75rem' }}>
              <h3 className="state-title">[!] {works.errorTitle}</h3>
              <p className="state-desc">{works.errorDesc}</p>
              <button type="button" className="btn btn-primary" onClick={loadRemoteProjects}>
                {works.errorRetry}
              </button>
            </div>
          )}

          {status === 'ready' && items.length === 0 && (
            <div className="state-panel" style={{ marginTop: '1.75rem' }}>
              <h3 className="state-title">{works.emptyNoDataTitle}</h3>
              <p className="state-desc">{works.emptyNoDataDesc}</p>
            </div>
          )}

          {status === 'ready' && items.length > 0 && (
            <div
              className={`works-split-stage${isSplit ? ' is-split' : ''}`}
              onMouseLeave={() => selectWork(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  selectWork(null);
                }
              }}
            >
              <ul className="work-ledger">
                {items.map((item) => {
                  const isActive = activeWorkId === item.id;
                  return (
                    <li
                      key={item.id}
                      className={`work-ledger-item${isActive ? ' is-expanded' : ''}`}
                      tabIndex={0}
                      aria-expanded={isActive}
                      onMouseEnter={() => selectWork(item.id)}
                      onFocus={() => selectWork(item.id)}
                    >
                      <div className="work-ledger-head">
                        <span className="mono-index">{item.index}</span>
                        <span className="work-ledger-title">{item.title}</span>
                        <span className="work-ledger-cat">
                          {item.role} · {item.year}
                        </span>
                        <motion.span
                          className="work-ledger-indicator"
                          aria-hidden="true"
                          animate={{ x: isActive ? 4 : 0, opacity: isActive ? 1 : 0.45 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        >
                          →
                        </motion.span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="work-side-column" aria-hidden={!isSplit}>
                <AnimatePresence mode="wait">
                  {activeWork && (
                    <motion.article
                      key={activeWork.id}
                      className="work-side-card"
                      initial={{ opacity: 0, x: 28, scale: 0.985 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: { duration: 0.44, ease: expoEase }
                      }}
                      exit={{
                        opacity: 0,
                        x: 32,
                        scale: 0.975,
                        transition: { duration: 0.34, ease: expoEase }
                      }}
                    >
                      <div className="work-side-header">
                        <div className="work-side-heading">
                          <span className="mono-index">
                            {activeWork.index} · {activeWork.role} · {activeWork.year}
                          </span>
                          <h3 className="work-side-title">{activeWork.title}</h3>
                        </div>

                        <div className="work-side-actions">
                          {activeWork.liveUrl ? (
                            <a
                              href={activeWork.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                            >
                              <span>{activeWork.previewCaption ?? works.liveCta}</span>
                              <span aria-hidden="true">↗</span>
                            </a>
                          ) : activeWork.statusBadge ? (
                            <span className="work-status-badge">{activeWork.statusBadge}</span>
                          ) : (
                            <span className="mono-index">{works.livePending}</span>
                          )}
                          {activeWork.repoUrl ? (
                            <a
                              href={activeWork.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                            >
                              <span>{works.repoCta}</span>
                              <span aria-hidden="true">↗</span>
                            </a>
                          ) : !activeWork.liveUrl && !activeWork.statusBadge ? (
                            <span className="mono-index">{works.repoPending}</span>
                          ) : null}
                        </div>
                      </div>

                      <p className="work-side-summary">{activeWork.summary}</p>

                      {activeWork.media && activeWork.media.length > 0 && (() => {
                        const safeIdx = Math.min(activeMediaIdx, activeWork.media.length - 1);
                        const currentMedia = activeWork.media[safeIdx];
                        const hasMultiple = activeWork.media.length > 1;
                        return (
                          <div className="work-media-gallery">
                            <figure className="work-media-figure">
                              <div className="work-media-slot is-wide">
                                {currentMedia.src ? (
                                  <img
                                    key={currentMedia.src}
                                    src={currentMedia.src}
                                    alt={currentMedia.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="work-media-img"
                                  />
                                ) : (
                                  <div className="work-media-placeholder">
                                    <div className="work-media-placeholder-head">
                                      <span className="mono-index">{currentMedia.placeholderCode}</span>
                                      <span className="mono-index">16:9</span>
                                    </div>
                                    <div className="work-media-placeholder-foot">
                                      <span className="work-media-hint">{currentMedia.placeholderHint}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <figcaption className="work-media-meta">
                                <span className="work-media-caption">{currentMedia.caption}</span>
                                {hasMultiple && (
                                  <span className="mono-index">
                                    {String(safeIdx + 1).padStart(2, '0')} /{' '}
                                    {String(activeWork.media.length).padStart(2, '0')}
                                  </span>
                                )}
                              </figcaption>
                            </figure>

                            {hasMultiple && (
                              <div className="work-media-thumbs" role="group" aria-label={activeWork.title}>
                                {activeWork.media.map((slot, idx) => {
                                  const isSelected = idx === safeIdx;
                                  return (
                                    <button
                                      key={slot.placeholderCode + slot.caption}
                                      type="button"
                                      className={`work-media-thumb${isSelected ? ' is-active' : ''}`}
                                      aria-pressed={isSelected}
                                      onClick={() => setActiveMediaIdx(idx)}
                                    >
                                      <span className="work-media-thumb-frame">
                                        {slot.src ? (
                                          <img
                                            src={slot.src}
                                            alt={slot.alt}
                                            loading="lazy"
                                            decoding="async"
                                            className="work-media-img"
                                          />
                                        ) : (
                                          <span className="mono-index">{slot.placeholderCode}</span>
                                        )}
                                      </span>
                                      <span className="work-media-thumb-label">{slot.placeholderCode}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {activeWork.specs && activeWork.specs.length > 0 ? (
                        <div
                          className={`dialog-details-grid work-specs-grid${
                            activeWork.specs.length === 4 ? ' is-quad' : ''
                          }`}
                        >
                          {activeWork.specs.map((spec) => (
                            <div key={spec.label} className="dialog-detail-block">
                              <h4>{spec.label}</h4>
                              <p>{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <ul className="tag-row">
                            {activeWork.stack.map((tech) => (
                              <li key={tech} className="tag-item">
                                {tech}
                              </li>
                            ))}
                          </ul>
                          <div className="dialog-details-grid work-specs-grid">
                            <div className="dialog-detail-block">
                              <h4>{works.contextLabel}</h4>
                              <p>{activeWork.context}</p>
                            </div>
                            <div className="dialog-detail-block">
                              <h4>{works.approachLabel}</h4>
                              <p>{activeWork.approach}</p>
                            </div>
                            <div className="dialog-detail-block">
                              <h4>{works.outcomeLabel}</h4>
                              <p>{activeWork.outcome}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {activeWork.highlights && activeWork.highlights.length > 0 && (
                        <div className="work-highlights">
                          <h4 className="work-highlights-title">{works.highlightsLabel}</h4>
                          <ol className="work-highlights-list">
                            {activeWork.highlights.map((item, idx) => (
                              <li key={item} className="work-highlight-item">
                                <span className="mono-index">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </motion.article>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
