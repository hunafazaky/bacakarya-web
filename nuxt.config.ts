// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-21',
  devtools: { enabled: true },

  // ssr: false,
  modules: [
    '@nuxt/fonts',
    'vuetify-nuxt-module',
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    public: {
      // Overridable via NUXT_PUBLIC_API_BASE. bacakarya-api serves everything
      // under /api (see openapi.yaml `servers`).
      apiBase: 'http://localhost:8080/api',
    },
  },

  app: {
    head: {
      link: [{ rel: 'stylesheet', href: '/layers.css' }],
    },
  },

  fonts: {
    families: [{ name: 'Lora', provider: 'google' }],
  },

  vuetify: {
    moduleOptions: {
      prefixComposables: ['useLayout'],
      styles: { configFile: 'assets/styles/settings.scss' },

      ssrClientHints: {
        reloadOnFirstRequest: false,
        viewportSize: true,
        prefersColorScheme: true,
        prefersReducedMotion: true,

        prefersColorSchemeOptions: {
          useBrowserThemeOnly: false,
        },
      },
    },
    vuetifyOptions: {
      theme: {
        // default 'system' requires `ssr: false` to avoid hydration warnings
        defaultTheme: 'dark',

        themes: {
          // A warm, literary palette - deep forest green + amber accent,
          // rather than Vuetify's default indigo demo colors.
          light: {
            colors: {
              primary: '#2F6F4E',
              secondary: '#B08A3E',
              background: '#FBF9F4',
              surface: '#FFFFFF',
            },
          },
          dark: {
            colors: {
              primary: '#4C9A73',
              secondary: '#D4AF6A',
              background: '#14181B',
              surface: '#1D2226',
            },
          },
        },
      },
      defaults: {
        VCard: { rounded: 'lg' },
        VBtn: { rounded: 'lg' },
        VTextField: { variant: 'outlined', density: 'comfortable' },
        VSelect: { variant: 'outlined', density: 'comfortable' },
        VFileInput: { variant: 'outlined', density: 'comfortable' },
      },
    },
  },

  eslint: {
    config: {
      import: {
        package: 'eslint-plugin-import-lite',
      },
    },
  },
})
