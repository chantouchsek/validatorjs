import type { InitialOptionsTsJest } from 'ts-jest'

const config: InitialOptionsTsJest = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 99.73,
      functions: 99.37,
      branches: 97.61,
      statements: 99.62,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  watchman: true,
  clearMocks: true,
  notify: true,
}

export default config
