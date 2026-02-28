import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  globalIgnores(['dist', 'templates/**/*', '**/*.test.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['templates/**/*'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettierConfig],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 启用Prettier规则作为ESLint错误
      'prettier/prettier': 'error',
      // TypeScript any类型配置
      '@typescript-eslint/no-explicit-any': 'off', // 允许显式使用any类型
      '@typescript-eslint/no-implicit-any': 'off', // 允许隐式any类型
      // 允许未使用的变量
      'no-unused-vars': 'off', // 禁止基本的未使用变量检查
      '@typescript-eslint/no-unused-vars': 'off', // 禁止TypeScript未使用变量检查
      '@typescript-eslint/no-empty-object-type': 'off', // 允许空对象类型
    },
  },
]);
