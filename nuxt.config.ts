// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: ['@nuxtjs/i18n'],

  i18n: {
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'el', language: 'el-GR', name: 'Ελληνικά', file: 'el.json' },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: false,
      alwaysRedirect: false,
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Athens City Guide by Red Bull',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        { name: 'theme-color', content: '#01152c' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'apple-mobile-web-app-title', content: 'Athens Guide' },
        {
          name: 'description',
          content:
            'Red Bull City Guide. Discover the best restaurants, bars, and hidden spots.',
        },
        { property: 'og:title', content: 'Athens City Guide by Red Bull' },
        {
          property: 'og:description',
          content:
            'Explore the best restaurants, bars and hidden spots in Athens.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/images/redbull_share.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Athens City Guide by Red Bull' },
        {
          name: 'twitter:description',
          content:
            'Explore the best restaurants, bars and hidden spots in Athens.',
        },
        { name: 'twitter:image', content: '/images/redbull_share.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        {
          rel: 'apple-touch-icon',
          href: '/images/redbull-logo-sm.png',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
      // Set the default theme before the app boots.
      // Override this by setting window.FoodMapConfig before loading the app.
      script: [
        {
          innerHTML:
            "window.FoodMapConfig = window.FoodMapConfig || { theme: 'redbull' }",
        },
      ],
    },
  },

  vite: {
    // Keep VITE_ prefix working so MapView.vue's VITE_MAPBOX_TOKEN is exposed.
    envPrefix: ['VITE_', 'NUXT_'],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'mapbox-gl': ['mapbox-gl'],
          },
        },
      },
    },
  },

  compatibilityDate: '2025-01-01',
});
