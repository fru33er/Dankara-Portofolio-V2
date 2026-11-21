import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { LocaleContent } from '../data/portfolio';
import { KineticNumeral } from './KineticNumeral';
import { TechIcon } from './TechIcon';

interface AboutSectionProps {
  content: LocaleContent;
}

const expoEase = [0.16, 1, 0.3, 1] as const;

export function AboutSection({ content }: AboutSectionProps) {
  const { about } = content;
  const [activeCapId, setActiveCapId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>(about.stackGroups[0]?.id ?? 'frontend');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = about.stackGroups.length;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % count;
    if (e.key === 'ArrowLeft') nextIndex = (index - 1 + count) % count;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = count - 1;
    if (nextIndex === null) return;

    e.preventDefault();
    const nextGroup = about.stackGroups[nextIndex];
    setActiveGroupId(nextGroup.id);
    tabRefs.current[nextGroup.id]?.focus();
  };

  const activeGroup =
    about.stackGroups.find((g) => g.id === activeGroupId) ?? about.stackGroups[0];

  return (
    <section id="tentang" className="section section-about">
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-sticky"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: expoEase }}
          >
            <div className="section-kicker-group">
              <KineticNumeral value={about.index} />
              <h2 id="about-title" className="section-title">
                {about.title}
              </h2>
            </div>

            <p className="about-statement">{about.statement}</p>

            <dl className="meta-ledger">
              {about.meta.map((row) => (
                <div key={row.label} className="meta-ledger-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <div className="about-right">
            <motion.div
              className="about-bio"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: expoEase }}
            >
              {about.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: expoEase }}
            >
              <div className="subsection-head">
                <h3 className="subsection-title">{about.capabilitiesTitle}</h3>
                <span className="mono-index">{about.capabilitiesHint}</span>
              </div>

              <ul id="capability-list" className="capability-list">
                {about.capabilities.map((cap) => {
                  const isOpen = activeCapId === cap.id;
                  return (
                    <li
                      key={cap.id}
                      className={`capability-item${isOpen ? ' is-open' : ''}`}
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onMouseEnter={() => setActiveCapId(cap.id)}
                      onMouseLeave={() => setActiveCapId((prev) => (prev === cap.id ? null : prev))}
                      onFocus={() => setActiveCapId(cap.id)}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                          setActiveCapId((prev) => (prev === cap.id ? null : prev));
                        }
                      }}
                    >
                      <div className="capability-row">
                        <span className="mono-index">{cap.index}</span>
                        <span className="capability-name">{cap.name}</span>
                        <motion.span
                          className="capability-plus"
                          aria-hidden="true"
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        >
                          +
                        </motion.span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`panel-${cap.id}`}
                            className="capability-desc-wrap"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: 'auto',
                              opacity: 1,
                              transition: { duration: 0.3, ease: expoEase }
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: { duration: 0.2, ease: expoEase }
                            }}
                          >
                            <p className="capability-desc">{cap.detail}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: expoEase }}
            >
              <div className="subsection-head">
                <h3 className="subsection-title">{about.stackTitle}</h3>
              </div>

              <div
                id="stack-tablist"
                className="stack-tablist"
                role="tablist"
                aria-label={about.stackTablistLabel}
              >
                {about.stackGroups.map((group, index) => {
                  const selected = group.id === activeGroup.id;
                  return (
                    <button
                      key={group.id}
                      ref={(el) => {
                        tabRefs.current[group.id] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`stack-tab-${group.id}`}
                      className="stack-tab"
                      aria-selected={selected}
                      aria-controls={`stack-panel-${group.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveGroupId(group.id)}
                      onKeyDown={(e) => handleTabKeyDown(e, index)}
                    >
                      {selected && (
                        <motion.span
                          layoutId="stack-active-pill"
                          className="tab-active-bg"
                          transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                        />
                      )}
                      <span className="tab-label">{group.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup.id}
                  role="tabpanel"
                  id={`stack-panel-${activeGroup.id}`}
                  aria-labelledby={`stack-tab-${activeGroup.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: expoEase }}
                >
                  <ul className="stack-grid">
                    {activeGroup.items.map((item, idx) => (
                      <motion.li
                        key={item.name}
                        className="stack-cell"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.045, ease: expoEase }}
                      >
                        <div className="stack-cell-top">
                          <span className="stack-icon-box" aria-hidden="true">
                            <TechIcon id={item.icon} />
                          </span>
                          <span className="mono-index" aria-hidden="true">
                            0{idx + 1}
                          </span>
                        </div>
                        <span className="stack-cell-name">{item.name}</span>
                        <span className="stack-cell-role">{item.role}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
