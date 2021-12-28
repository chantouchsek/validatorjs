import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 90,
      statements: 99,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  watchman: true,
  clearMocks: true,
  notify: true,
}

export default config
