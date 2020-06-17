module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/core/**/*.test.(ts)'],
  testEnvironment: 'node',
}
