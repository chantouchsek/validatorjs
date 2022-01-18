import type { InitialOptionsTsJest } from 'ts-jest'

const config: InitialOptionsTsJest = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 99.73,
      functions: 99.39,
      branches: 97.42,
      statements: 99.75,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  watchman: true,
  clearMocks: true,
  notify: true,
}

export default config
