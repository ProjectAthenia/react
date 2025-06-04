module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false // Suppress TypeScript version warnings
  },
  rules: {
    // TypeScript rules - make them warnings instead of errors
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': true }],
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/no-useless-constructor': 'warn',
    
    // React Hook rules - make them warnings
    'react-hooks/exhaustive-deps': 'warn',
    
    // General JS rules
    'eqeqeq': ['warn', 'always'],
    'no-empty-pattern': 'warn',
    'no-useless-escape': 'warn',
    
    // Testing Library rules - make critical ones errors, others warnings
    'testing-library/no-wait-for-multiple-assertions': 'warn',
    'testing-library/no-node-access': 'warn', // Made this a warning instead of error
    
    // Turn off some overly strict rules
    'no-console': 'off',
    '@typescript-eslint/ban-ts-comment': 'off'
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{test,spec}.*'],
      rules: {
        // Relax rules for test files
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'testing-library/no-node-access': 'off' // Allow direct node access in tests if needed
      }
    }
  ]
}; 