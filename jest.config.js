module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFiles: [
    '<rootDir>/jest/vars.js'
  ],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/../covfefe-common/src/$1',
    '^@domain': '<rootDir>/src/domain/',
    '^@app/(.*)$': '<rootDir>/src/$1'
  },
  globalSetup: '<rootDir>/jest/setup.js',
  globalTeardown: '<rootDir>/jest/teardown.js'
};
