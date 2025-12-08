// ESLint 9 "flat config" format - single source of truth for linting rules
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  // Global ignores - files/folders ESLint should never touch
  {
    ignores: ['node_modules', '.expo', 'dist', 'build', 'android', 'ios', '*.log'],
  },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript rules (includes parser) - typescript-eslint v8+ unified package
  ...tseslint.configs.recommended,

  // Config files and mocks use CommonJS (require/module.exports)
  {
    files: ['*.config.js', '*.config.cjs', 'metro.config.js', 'eslint.config.cjs', '__mocks__/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Jest test files - add Jest globals
  {
    files: ['**/__tests__/**', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', 'jest.setup.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },

  // Main application code - React Native + TypeScript
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['*.config.js', '*.config.cjs', 'metro.config.js', 'eslint.config.cjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/prop-types': 'off', // Using TypeScript for prop validation

      // React Hooks - prevent common mistakes
      ...reactHooks.configs.recommended.rules,

      // React Native specific
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'off', // TV app may need platform files
      'react-native/no-inline-styles': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Prettier integration - format errors as ESLint errors
      ...prettier.rules,
      'prettier/prettier': 'error',
    },
  },
];
