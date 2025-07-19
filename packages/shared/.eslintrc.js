module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};