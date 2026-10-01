import eslintConfigPrettier from 'eslint-config-prettier'
import vuetify from 'eslint-config-vuetify'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  vuetify({
    ts: true,
  }),
  {
    // Regenerated via `npm run gen:types` - not hand-written, don't lint it.
    ignores: ['shared/types/api.d.ts'],
  },
  // Wajib diletakkan di paling akhir agar menimpa & mematikan aturan formatting dari Vuetify / Nuxt
  eslintConfigPrettier
)
