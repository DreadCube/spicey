module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    'react/jsx-filename-extension': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-underscore-dangle': 'off',
  },
};
