import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // Recommended rules untuk Vue
  ...pluginVue.configs['flat/recommended'],

  // Rule kustom & penyesuaian proyek
  {
    files: ['**/*.vue', '**/*.js'],
    rules: {
      'vue/multi-word-component-names': 'off', // Menyesuaikan dengan standar penamaan Nuxt
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },

  // Folder yang diabaikan (menggantikan .eslintignore)
  {
    ignores: ['.nuxt/', 'node_modules/', 'dist/', 'static/'],
  },
  eslintConfigPrettier,
];
