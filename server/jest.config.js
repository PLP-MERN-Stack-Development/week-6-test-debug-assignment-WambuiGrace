// jest.config.js - Server-side Jest configuration

module.exports = {
  displayName: 'server',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!**/node_modules/**',
  ],
};