import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts, svelte}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  prettierConfig,
];
