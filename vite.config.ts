import { resolve } from 'path'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
  server: {
    port: 3000,
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist',
        }),
      ],
    },
  },
})
