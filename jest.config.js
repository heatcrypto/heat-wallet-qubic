module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],  // Point Jest to the correct test directory
  testMatch: ['**/*.test.ts'],  // Look for any files ending in .test.ts
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};