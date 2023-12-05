import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
  test: {
    coverage: {
      exclude: ['src/types.ts', '*.config.?(c|m)[jt]s?(x)'],
    },
    deps: {
      interopDefault: true,
    },
    includeSource: ['src/**/*.{js,ts}'],
  },
})
