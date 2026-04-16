import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import pluginN from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'
import unusedImports from 'eslint-plugin-unused-imports'
import prettier from 'eslint-config-prettier'

export default [
  // 基本 JS 規則
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      import: pluginImport,
      n: pluginN,
      promise: pluginPromise,
      'unused-imports': unusedImports
    },
    rules: {
      /**
       * ------------------------
       * TypeScript 強化
       * ------------------------
       */
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',

      /**
       * ------------------------
       * import / 模組安全（DI 很重要）
       * ------------------------
       */
      'import/no-unresolved': 'error',
      'import/no-cycle': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always'
        }
      ],

      /**
       * ------------------------
       * Node.js
       * ------------------------
       */
      'n/no-missing-import': 'off', // TS 已處理
      'n/no-unsupported-features/es-syntax': 'off',

      /**
       * ------------------------
       * Promise / async
       * ------------------------
       */
      'promise/catch-or-return': 'warn',
      'promise/no-return-wrap': 'error',

      /**
       * ------------------------
       * 清理 unused
       * ------------------------
       */
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },

  // 關閉與 Prettier 衝突的規則
  prettier
]