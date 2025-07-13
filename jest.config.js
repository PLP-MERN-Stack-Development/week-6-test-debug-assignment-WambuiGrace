// jest.config.js - Root Jest configuration file

module.exports = {
  // Base configuration for all tests
  projects: [
    '<rootDir>/client/jest.config.js',
    '<rootDir>/server/jest.config.js',
  ],
  
  // Global configuration
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
}; 