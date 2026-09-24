// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-21',
  devtools: { enabled: true },

  // ssr: false,
  modules: ['@nuxt/fonts', 'vuetify-nuxt-module', '@nuxt/eslint', '@pinia/nuxt'],

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: '/layers.css' },
      ],
    },
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
          light: {},
          dark: {},
        },
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