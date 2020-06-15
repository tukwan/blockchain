module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-inferrable-types': [
      'warn',
      {
        ignoreParameters: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    strict: ['error', 'global'],
    'array-bracket-spacing': ['off'],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'dot-notation': [
      'error',
      {
        allowKeywords: true,
        allowPattern: '',
      },
    ],
    'eol-last': ['error', 'always'],
    eqeqeq: ['error', 'smart'],
    'generator-star-spacing': ['error', 'before'],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', 120, 2],
    'no-debugger': 'error',
    'no-console': 'warn',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'no-redeclare': [
      'error',
      {
        builtinGlobals: true,
      },
    ],
    'no-trailing-spaces': [
      'error',
      {
        skipBlankLines: false,
      },
    ],
    'no-undef': 'error',
    'no-use-before-define': 'off',
    'no-var': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'promise/always-return': 'off',
    'promise/avoid-new': 'off',
    'prefer-arrow-callback': 'error',
    'no-var': 'error',
  },
}
