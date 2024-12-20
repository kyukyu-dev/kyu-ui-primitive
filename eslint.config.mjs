import noForOfArrayPlugin from 'eslint-plugin-no-for-of-array'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginJs from '@eslint/js'

export default [
  {
    ignores: [
      '.yarn/**',
      'coverage/**',
      '**/dist/**',
      '**/cache/**',
      '.pnp.*',
      '**/*/d.ts',
      'node_modules/**',
      'custom-type-package',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        ...globals['shared-node-browser'],
        ...globals.es2015,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        parser: tseslint.parser,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['packages/*/*/src/*.ts'],
    ignores: ['**/*.spec.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'no-for-of-array': noForOfArrayPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'no-for-of-array/no-for-of-array': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.objest.name="Object"][callee.property.name="entries"]',
          message:
            'Do not use Object.entries for performance. Consider using alternatives like Object.keys() or Object.values().',
        },
      ],
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            [
              // Node.js builtins.
              // Node.js builtins prefixed with `node:`.
              `^node:`,
              // Packages.
              // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
              '^@?\\w',
              // Internal packages.
              '^(src)(/.*|$)',
              // Parent imports. Put `..` last.
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              // Other relative imports. Put same-folder imports and `.` last.
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
          ],
        },
      ],
    },
  },
  {
    rules: {
      'no-implicit-coercion': 'error',
      'no-warning-comments': [
        'warn',
        {
          terms: ['TODO', 'FIXME', 'XXX', 'BUG'],
          location: 'anywhere',
        },
      ],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        { format: ['camelCase', 'UPPER_CASE', 'PascalCase'], selector: 'variable', leadingUnderscore: 'allowDouble' },
        { format: ['camelCase', 'PascalCase'], selector: 'function' },
        { format: ['PascalCase'], selector: 'interface' },
        { format: ['PascalCase'], selector: 'typeAlias' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, caughtErrors: 'none' }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'private-static-field',
            'public-instance-field',
            'private-instance-field',
            'public-constructor',
            'private-constructor',
            'public-instance-method',
            'private-instance-method',
          ],
        },
      ],
      'prefer-object-has-own': 'error',
    },
  },
]
