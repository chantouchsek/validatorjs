import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

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
    ...additionalPlugins
  ],
})

export default [
  createConfig('src/index.js', 'lib/index.js'),
  createConfig('src/index.js', 'lib/index.min.js', [uglify()])
]
