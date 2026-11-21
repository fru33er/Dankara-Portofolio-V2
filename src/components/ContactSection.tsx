import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { portfolioConfig, type LocaleContent } from '../data/portfolio';
import { KineticNumeral } from './KineticNumeral';
import { RollText } from './RollText';

interface ContactSectionProps {
  content: LocaleContent;
  onAnnounce: (msg: string) => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FeedbackState {
  title: string;
  desc: string;
  mailtoHref?: string;
}

const expoEase = [0.16, 1, 0.3, 1] as const;

export function ContactSection({ content, onAnnounce }: ContactSectionProps) {
  const { contact, ui } = content;
  const formLoc = contact.form;

  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyEmail = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(portfolioConfig.contactEmail);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      const helper = document.createElement('textarea');
      helper.value = portfolioConfig.contactEmail;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      document.body.removeChild(helper);
    }

    if (ok) {
      setCopied(true);
      onAnnounce(contact.copiedAnnouncement);
      window.setTimeout(() => setCopied(false), 2200);
    } else {
      onAnnounce(contact.copyFailedAnnouncement);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: FieldErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) nextErrors.name = formLoc.errName;
    if (!email.trim()) nextErrors.email = formLoc.errEmailRequired;
    else if (!emailPattern.test(email.trim())) nextErrors.email = formLoc.errEmailInvalid;
    if (!subject.trim()) nextErrors.subject = formLoc.errSubject;
    if (message.trim().length < 10) nextErrors.message = formLoc.errMessage;

    setErrors(nextErrors);
    const errorKeys = Object.keys(nextErrors) as (keyof FieldErrors)[];
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      if (firstKey === 'name') nameRef.current?.focus();
      else if (firstKey === 'email') emailRef.current?.focus();
      else if (firstKey === 'subject') subjectRef.current?.focus();
      else if (firstKey === 'message') messageRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    };

    if (portfolioConfig.formEndpoint) {
      try {
        const res = await fetch(portfolioConfig.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFeedback({ title: formLoc.liveSuccessTitle, desc: formLoc.liveSuccessDesc });
        onAnnounce(formLoc.liveSuccessTitle);
      } catch {
        setFeedback({
          title: `[!] ${formLoc.networkErrorTitle}`,
          desc: formLoc.networkErrorDesc
        });
        onAnnounce(formLoc.networkErrorTitle);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 260));
    const mailHref = `mailto:${encodeURIComponent(portfolioConfig.contactEmail)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(`${payload.message}\n\n${payload.name} (${payload.email})`)}`;
    setFeedback({
      title: formLoc.previewSuccessTitle,
      desc: formLoc.previewSuccessDesc,
      mailtoHref: mailHref
    });
    onAnnounce(formLoc.previewSuccessTitle);
    setSubmitting(false);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setErrors({});
    setFeedback(null);
    nameRef.current?.focus();
  };

  const errorCount = Object.keys(errors).length;

  return (
    <section id="kontak" className="section section-contact">
      <div className="container">
        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: expoEase }}
          >
            <div className="section-kicker-group">
              <KineticNumeral value={contact.index} />
              <h2 id="contact-title" className="section-title">
                {contact.title}
              </h2>
            </div>

            <p className="contact-lead">{contact.lead}</p>

            <div className="direct-email-card">
              <span className="mono-index">{contact.emailLabel}</span>
              <p className="direct-email-value">{portfolioConfig.contactEmail}</p>
              <div className="direct-email-actions">
                <button
                  type="button"
                  id="copy-email-btn"
                  className="btn btn-primary roll-trigger"
                  data-cursor-label={ui.cursorCopy}
                  onClick={handleCopyEmail}
                >
                  <span id="copy-email-text">
                    {copied ? contact.copiedEmailBtn : contact.copyEmailBtn}
                  </span>
                </button>
                <a
                  href={`mailto:${portfolioConfig.contactEmail}`}
                  className="btn btn-secondary roll-trigger"
                >
                  <RollText text={contact.openMailBtn} />
                </a>
              </div>
            </div>

            <ul className="social-list">
              {portfolioConfig.socials.map((soc) => (
                <li key={soc.id} className="social-row">
                  {soc.url ? (
                    <a
                      className="social-link"
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{soc.label}</span>
                      <span className="mono-index">{soc.handle} ↗</span>
                    </a>
                  ) : (
                    <div className="social-pending">
                      <span>
                        {soc.label} {soc.handle}
                      </span>
                      <span className="mono-index">{contact.socialNotLinked}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.08, ease: expoEase }}
          >
            <form id="contact-form" className="contact-form" noValidate onSubmit={handleSubmit}>
              <AnimatePresence>
                {errorCount > 0 && (
                  <motion.div
                    id="form-error-summary"
                    className="form-summary-error"
                    role="alert"
                    tabIndex={-1}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    [!] {formLoc.errorSummaryPrefix} ({errorCount})
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="field-group">
                <label htmlFor="field-name" className="field-label">
                  {formLoc.nameLabel}
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  id="field-name"
                  name="name"
                  className="field-input"
                  autoComplete="name"
                  placeholder={formLoc.namePlaceholder}
                  required
                  value={name}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                />
                {errors.name && (
                  <p id="error-name" className="field-error" role="alert">
                    [!] {errors.name}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="field-email" className="field-label">
                  {formLoc.emailLabel}
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  id="field-email"
                  name="email"
                  className="field-input"
                  autoComplete="email"
                  placeholder={formLoc.emailPlaceholder}
                  required
                  value={email}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                />
                {errors.email && (
                  <p id="error-email" className="field-error" role="alert">
                    [!] {errors.email}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="field-subject" className="field-label">
                  {formLoc.subjectLabel}
                </label>
                <input
                  ref={subjectRef}
                  type="text"
                  id="field-subject"
                  name="subject"
                  className="field-input"
                  placeholder={formLoc.subjectPlaceholder}
                  required
                  value={subject}
                  aria-invalid={errors.subject ? 'true' : undefined}
                  aria-describedby={errors.subject ? 'error-subject' : undefined}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
                  }}
                />
                {errors.subject && (
                  <p id="error-subject" className="field-error" role="alert">
                    [!] {errors.subject}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="field-message" className="field-label">
                  {formLoc.messageLabel}
                </label>
                <textarea
                  ref={messageRef}
                  id="field-message"
                  name="message"
                  className="field-textarea"
                  placeholder={formLoc.messagePlaceholder}
                  required
                  value={message}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                  }}
                />
                {errors.message && (
                  <p id="error-message" className="field-error" role="alert">
                    [!] {errors.message}
                  </p>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  id="form-submit-btn"
                  className="btn btn-primary"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? formLoc.submittingBtn : formLoc.submitBtn}
                </button>
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    id="form-feedback"
                    className="form-feedback"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.24, ease: expoEase } }}
                    exit={{ opacity: 0, y: 6, transition: { duration: 0.14 } }}
                  >
                    <strong>{feedback.title}</strong>
                    <p className="state-desc">{feedback.desc}</p>
                    <div className="form-actions">
                      {feedback.mailtoHref && (
                        <a href={feedback.mailtoHref} className="btn btn-primary">
                          {formLoc.openDraftMailBtn}
                        </a>
                      )}
                      <button type="button" className="btn btn-secondary" onClick={handleReset}>
                        {formLoc.resetBtn}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
