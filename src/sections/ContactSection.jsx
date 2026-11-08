import { useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Section from '../components/Sections';
import ResumePreview from '../components/ResumePreview';
import { content } from '../data/content';
import { contactDetails, socials } from '../data/socials';
import { contactConfig as config } from '../data/contactConfig';
import { submitContact, validateContact } from '../data/contactHandler';
import useTheme from '../hooks/useTheme';

export default function ContactSection({ headingLevel = 'h1' }) {
  const [errors, setErrors] = useState({}), [status, setStatus] = useState('idle');
  const captcha = useRef(null), token = useRef(''), captchaAnchor = useRef(null);
  const inFlight = useRef(false), request = useRef(null), mounted = useRef(false);
  const { theme } = useTheme(); const c = content.contact;
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; token.current = ''; request.current?.abort(); };
  }, []);
  useEffect(() => { token.current = ''; }, [theme]);
  const captchaFailure = (message) => { token.current = ''; setErrors((current) => ({ ...current, captcha: message })); };
  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget, values = Object.fromEntries(new FormData(form));
    const next = validateContact(values);
    if (!token.current) next.captcha = config.captchaRequired;
    if (values.botcheck) { setStatus('error'); return; }
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      if (first === 'captcha') captchaAnchor.current?.focus(); else form.elements[first]?.focus();
      return;
    }
    inFlight.current = true; setStatus('sending');
    const controller = new AbortController(); request.current = controller;
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
      await submitContact(values, token.current, { signal: controller.signal });
      if (mounted.current) { form.reset(); setStatus('success'); }
    } catch {
      if (mounted.current) setStatus('error');
    } finally {
      clearTimeout(timeout); token.current = ''; request.current = null; inFlight.current = false;
      if (mounted.current) captcha.current?.resetCaptcha();
    }
  }
  return <Section id="contact" {...c} headingLevel={headingLevel}>
    <div className="contact-grid"><div data-reveal><p className="body-copy">{c.direct}</p>
      <p className="contact-email">{contactDetails.email}</p>
      <p className="eyebrow">{c.channel}</p><ul className="contact-socials">{socials.map((social) => <li key={social.label}><a className="filter-button" href={social.href} target="_blank" rel="noopener noreferrer">{social.label} ↗</a></li>)}</ul>
    </div>
    <form onSubmit={submit} noValidate className="contact-form" aria-busy={status === 'sending'}>
      <div hidden aria-hidden="true"><input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" /></div>
      <fieldset disabled={status === 'sending'} className="contact-fields">
      {['name', 'email', 'message'].map((field) => <div className="field-group" key={field}>
        <label htmlFor={'contact-' + field}>{c[field]}</label>
        {field === 'message' ? <textarea id={'contact-' + field} name={field} rows={5} required minLength={10} maxLength={5000} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? field + '-error' : undefined} className="hud-field" />
          : <input id={'contact-' + field} name={field} type={field === 'email' ? 'email' : 'text'} autoComplete={field} required maxLength={field === 'name' ? 100 : 254} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? field + '-error' : undefined} className="hud-field" />}
        {errors[field] && <p id={field + '-error'} className="field-error">{errors[field]}</p>}
      </div>)}</fieldset>
      <div ref={captchaAnchor} tabIndex={-1} className="captcha-panel" role="group" aria-label={config.captchaLabel} aria-describedby={errors.captcha ? 'captcha-error' : undefined}>
        <HCaptcha key={theme} ref={captcha} sitekey={config.captchaSitekey} reCaptchaCompat={false} theme={theme} size="compact"
          onVerify={(value) => { token.current = value; setErrors((current) => ({ ...current, captcha: undefined })); }}
          onExpire={() => captchaFailure(config.captchaExpired)}
          onChalExpired={() => captchaFailure(config.captchaExpired)}
          onError={() => captchaFailure(config.captchaError)} />
        {errors.captcha && <p id="captcha-error" className="field-error" role="alert">{errors.captcha}</p>}
      </div>
      <div className="form-bottom"><button type="submit" disabled={status === 'sending'} className="hud-button" data-magnetic>{status === 'sending' ? c.sending : c.send} ↗</button>
        <p role="status" aria-live="polite" className="form-status">{status === 'success' ? config.success : status === 'error' ? config.error : ''}</p>
      </div>
    </form></div><ResumePreview />
  </Section>;
}
