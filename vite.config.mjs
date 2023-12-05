import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      interopDefault: true,
    },
    includeSource: ['src/**/*.{js,ts}'],
    coverage: {
      exclude: ['src/types.ts', '*.config.?(c|m)[jt]s?(x)'],
    },
  },
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
})
