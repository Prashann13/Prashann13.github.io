// These are intentionally public frontend identifiers, never private API secrets.
export const contactConfig = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: 'deda0711-87b6-4780-9be9-013ee6e93948',
  captchaSitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
  subject: 'Portfolio contact — Prashann Mishra', timeoutMs: 20000,
  success: 'Message sent. Thank you.', error: 'Message could not be sent. Please try again or email me directly.',
  captchaLabel: 'Spam protection', captchaRequired: 'Complete hCaptcha before sending.',
  captchaExpired: 'hCaptcha expired. Please complete it again.', captchaError: 'hCaptcha is unavailable. Please retry or email me directly.',
  errors: { name: 'Enter your name (up to 100 characters).', email: 'Enter a valid email address (up to 254 characters).', message: 'Enter a message between 10 and 5000 characters.' },
  resume: { title: 'Résumé', activate: 'View résumé here', open: 'Open PDF', download: 'Download PDF', viewerTitle: 'Résumé of Prashann Mishra' },
};
