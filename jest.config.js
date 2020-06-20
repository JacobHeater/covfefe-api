module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFiles: [
    '<rootDir>/src/__spec__/jest/vars.js'
  ],
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/../covfefe-common/src/$1',
    '^@domain': '<rootDir>/src/domain/',
    '^@app/(.*)$': '<rootDir>/src/$1'
  },
  globalSetup: '<rootDir>/src/__spec__/jest/setup.ts',
  globalTeardown: '<rootDir>/src/__spec__/jest/teardown.ts'
};
