// Atrapa chrome.i18n na podstawie _locales/<lang>/messages.json (zachowanie jak w Chrome:
// nazwane placeholdery $NAME$ → "content": "$1" → podstawienia).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadMessages(lang) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, '_locales', lang, 'messages.json'), 'utf8'));
}

/** Obiekt zgodny z chrome.i18n dla danego języka. */
export function i18nFor(lang) {
  const messages = loadMessages(lang);
  return {
    getUILanguage: () => (lang === 'pl' ? 'pl' : 'en-US'),
    getMessage(key, subs) {
      if (key === '@@ui_locale') return lang === 'pl' ? 'pl' : 'en_US';
      const m = messages[key];
      if (!m) return '';
      const list = subs === undefined ? [] : [].concat(subs).map(String);
      return m.message.replace(/\$\$|\$([A-Za-z0-9_]+)\$/g, (whole, name) => {
        if (whole === '$$') return '$'; // jak w Chrome: „$$” → „$”
        const ph = m.placeholders && m.placeholders[name.toLowerCase()];
        if (!ph) return '';
        return ph.content.replace(/\$(\d)/g, (__, n) => list[Number(n) - 1] ?? '');
      });
    },
  };
}

/** Ustawia globalThis.chrome.i18n na wybrany język (zachowuje resztę atrapy chrome). */
export function installI18n(lang) {
  globalThis.chrome = { ...(globalThis.chrome || {}), i18n: i18nFor(lang) };
}
