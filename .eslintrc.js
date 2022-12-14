module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'for-direction': 'warn',
    'no-await-in-loop': 'warn',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'warn',
    'no-const-assign': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-else-if': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-func-assign': 'error',
    'no-import-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-self-assign': 'warn',
    'no-self-compare': 'warn',
    'no-sparse-arrays': 'warn',
    'no-this-before-super': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-optional-chaining': [
      'error',
      { disallowArithmeticOperators: true },
    ],
    'no-unused-private-class-members': 'warn',
    'no-use-before-define': 'error',
    'valid-typeof': 'error',

    camelcase: 'error',
    curly: 'warn',
    'default-case': 'warn',
    'default-case-last': 'warn',
    'default-param-last': 'error',
    'dot-notation': 'error',
    eqeqeq: ['warn', 'smart'],
    'func-style': ['error', 'declaration'],
    'max-classes-per-file': ['error', 1],
    'no-delete-var': 'warn',
    'no-global-assign': 'error',
    'no-invalid-this': 'error',
    'no-labels': 'error',
    'no-multi-assign': 'warn',
    'no-negated-condition': 'warn',
    'no-new': 'warn',
    'no-new-object': 'error',
    'no-param-reassign': 'warn',
    'no-redeclare': 'warn',
    'no-return-assign': 'warn',
    'no-sequences': 'warn',
    'no-throw-literal': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-var': 'error',
    'prefer-const': 'warn',
    'spaced-comment': 'warn',

    'eol-last': 'error',
    'key-spacing': 'warn',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-spaces': 'warn',
    'no-tabs': 'warn',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'semi-spacing': 'warn',

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
