// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Finance Flow (FinFlow)',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
  typescript: {
    strict: true,
  },
  hooks: {
    'vite:extendConfig'(config) {
      config.plugins ??= [];
      config.plugins.unshift({
        name: 'stub-app-manifest',
        enforce: 'pre',
        resolveId(id) {
          if (id === '#app-manifest') return '\0virtual:app-manifest-stub';
          return null;
        },
        load(id) {
          if (id === '\0virtual:app-manifest-stub') return 'export default {}\n';
          return null;
        },
      });
    },
  },
});