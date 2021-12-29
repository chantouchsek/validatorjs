import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 98,
      functions: 99,
      branches: 91,
      statements: 98,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  watchman: true,
  clearMocks: true,
  notify: true,
}

export default config
