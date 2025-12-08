// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  // Use Expo's Jest preset for React Native with Expo
  // Provides: transform, transformIgnorePatterns, testEnvironment, resolver, moduleFileExtensions
  preset: 'jest-expo',

  // Run setup after Jest environment is configured
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Reset mocks between tests for isolation
  clearMocks: true,

  // Mock static assets that can't be imported in Node
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
