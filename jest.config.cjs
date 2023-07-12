module.exports = {
    verbose: true,
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testMatch: [
        "<rootDir>/src/**/*.test.ts"
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/build/'
    ],
    testTimeout: 600000,
};