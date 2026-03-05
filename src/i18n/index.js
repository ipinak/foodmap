import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import el from './locales/el.json'

// Detect the device/browser locale; fall back to English
const browserLocale = (navigator.language ?? 'en').split('-')[0]
const locale = ['en', 'el'].includes(browserLocale) ? browserLocale : 'en'

export const i18n = createI18n({
  legacy: false,          // use Composition API mode
  locale,
  fallbackLocale: 'en',
  messages: { en, el },
})
