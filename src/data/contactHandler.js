import { contactConfig as config } from './contactConfig.js';

export function validateContact(values) {
  const errors = {};
  const name = String(values.name || '').trim(), email = String(values.email || '').trim(), message = String(values.message || '').trim();
  if (!name || name.length > 100) errors.name = config.errors.name;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = config.errors.email;
  if (message.length < 10 || message.length > 5000) errors.message = config.errors.message;
  return errors;
}

export async function submitContact(values, captchaToken, { fetcher = fetch, signal } = {}) {
  if (Object.keys(validateContact(values)).length || values.botcheck || !captchaToken) throw new Error(config.error);
  const response = await fetcher(config.endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, signal,
    body: JSON.stringify({ access_key: config.accessKey, subject: config.subject,
      name: values.name.trim(), email: values.email.trim(), message: values.message.trim(),
      botcheck: '', 'h-captcha-response': captchaToken }),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true) throw new Error(config.error);
  return { sent: true };
}
