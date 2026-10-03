// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-21',
  devtools: { enabled: true },

  // ssr: false,
  css: ['~/assets/styles/prose.css', '~/assets/styles/overrides.css'],

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
      htmlAttrs: { lang: 'en' },
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
        // Off so the OS color scheme never overrides the light default.
        // The theme toggle (see useAppTheme) is the only way to switch.
        prefersColorScheme: false,
        prefersReducedMotion: true,
      },
    },
    vuetifyOptions: {
      theme: {
        // default 'system' requires `ssr: false` to avoid hydration warnings
        defaultTheme: 'light',

        themes: {
          // A warm, literary palette - deep forest green + amber accent,
          // rather than Vuetify's default indigo demo colors.
          light: {
            colors: {
              primary: '#2F6F4E',
              secondary: '#B08A3E',
              // Vuetify picks white text for these (APCA), which is only
              // 3.2:1 on this gold - below the 4.5:1 WCAG AA minimum. Dark
              // text on it is 5.5:1.
              'on-secondary': '#1E1708',
              background: '#FBF9F4',
              surface: '#FFFFFF',
            },
          },
          dark: {
            colors: {
              primary: '#4C9A73',
              // White on this green is 3.4:1 (below AA); dark text is 5.4:1.
              'on-primary': '#06180F',
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
