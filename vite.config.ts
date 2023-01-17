import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: { globals: true },
  plugins: [],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
})
