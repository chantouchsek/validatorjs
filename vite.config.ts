import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    deps: {
      interopDefault: true,
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
