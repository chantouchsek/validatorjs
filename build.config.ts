import { readFileSync } from 'node:fs'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/main', 'src/phone'],
  declaration: 'compatible',
  rollup: {
    emitCJS: true,
    // The package supports Node 12.20, independently of development tooling.
    esbuild: { target: 'node12.20' },
    // lodash-es cannot be required by CommonJS consumers on older Node versions.
    inlineDependencies: ['lodash-es'],
    output: {
      banner: `/*! Bundled lodash-es license:\n${readFileSync(new URL('./node_modules/lodash-es/LICENSE', import.meta.url), 'utf8')}\n*/`,
    },
  },
  hooks: {
    'build:before': (context) => {
      // The automatic preset marks production dependencies as external first.
      context.options.externals = context.options.externals.filter(id => id !== 'lodash-es')
    },
  },
})
