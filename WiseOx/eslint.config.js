import globals from 'globals';
import js from '@eslint/js';
import airbnbBase from 'eslint-config-airbnb-base/rules/style'; // Import only style rules for base
import pluginImport from 'eslint-plugin-import';

// Base config object to reuse
const baseLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
  globals: {
    ...globals.browser, // Default to browser
  },
};

const basePlugins = {
  import: pluginImport,
};

const baseSettings = {
  'import/resolver': {
    node: {
      extensions: ['.js'],
    },
  },
};

// Custom rules based on Airbnb, with overrides
const customRules = {
  // Start with Airbnb style rules (can pick others like 'best-practices', 'errors', etc. if needed)
  // We are avoiding the main airbnbBase entry point to prevent it enabling plugins globally
  ...airbnbBase.rules, // Note: This only imports 'rules/style' rules

  // General Overrides/Preferences
  'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // Allow specific console methods
  'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
  'no-param-reassign': ['warn', { props: false }],
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_$', varsIgnorePattern: '^_$' }], // Ignore unused if named _
  'no-undef': 'warn',
  'func-names': 'off',
  'prefer-arrow-callback': 'off',
  'object-shorthand': ['warn', 'properties'],
  'no-restricted-syntax': 'off',
  'no-new': 'off',
  'import/prefer-default-export': 'off', // Allow named exports
  'class-methods-use-this': 'off', // Allow class methods that don't use 'this'

  // Rules that might need adjusting per environment (below)
  'import/no-extraneous-dependencies': ['error', { devDependencies: false }], // Default: No devDeps
  'import/no-commonjs': 'error', // Default: Enforce ES modules
};

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'js/**'], // Added dist, js (assuming js is compiled output or old)
  },

  // Configuration for frontend JavaScript (Browser, ES Modules)
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ...baseLanguageOptions,
      globals: {
        ...globals.browser,
        Swiper: 'readonly',
        lottie: 'readonly',
        jQuery: 'readonly',
        $: 'readonly',
        console: 'readonly', // Keep console allowed here
      },
    },
    plugins: basePlugins,
    settings: baseSettings,
    rules: {
      ...js.configs.recommended.rules, // Apply recommended rules
      ...customRules, // Apply our customized Airbnb rules
      // Frontend-specific overrides
      'no-alert': 'warn',
    },
  },

  // Configuration for API routes (Node.js, ES Modules)
  {
    files: ['api/**/*.js'],
    languageOptions: {
      ...baseLanguageOptions,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: basePlugins,
    settings: baseSettings,
    rules: {
      ...js.configs.recommended.rules,
      ...customRules,
      // Node/ES Module specific overrides
      'import/no-commonjs': 'error',
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off', // Node API might require various deps
    },
  },

  // Configuration for build/config files (Node.js, usually ES Modules)
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ...baseLanguageOptions,
      sourceType: 'module', // Explicitly module
      globals: {
        ...globals.node,
        __dirname: 'readonly', // For vite config if needed
      },
    },
    plugins: basePlugins,
    settings: baseSettings,
    rules: {
      ...js.configs.recommended.rules,
      ...customRules,
      // Config specific overrides
      'import/no-extraneous-dependencies': 'off', // ALLOW devDeps here (disabled for workaround)
      'import/no-commonjs': 'error', // Should be ES modules
    },
  },
];
