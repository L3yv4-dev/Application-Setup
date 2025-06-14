module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // incluye eslint-config-prettier y eslint-plugin-prettier
  ],
  rules: {
    'prettier/prettier': 'error', // marca errores de formateo
    '@typescript-eslint/no-unused-vars': ['error'],
    // otras reglas personalizadas
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};
