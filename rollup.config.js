import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import json from '@rollup/plugin-json'

const createConfig = (input, output, additionalPlugins = []) => ({
  input,
  output: {
    file: output,
    format: 'esm'
  },
  plugins: [
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
    commonjs({
      include: 'node_modules/**'
    }),
    json(),
    ...additionalPlugins
  ],
})

export default [
  createConfig('src/index.js', 'dist/index.js'),
  createConfig('src/index.js', 'dist/index.min.js', [uglify()])
]
