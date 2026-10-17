import config from '@antfu/eslint-config'

export default config({}, {
  rules: {
    'antfu/if-newline': 'off',
    'curly': 'off',
    // Keep compatibility with consumer Node versions without Object.hasOwn.
    'e18e/prefer-object-has-own': 'off',
    // Avoid unrelated source and documentation rewrites during tooling upgrades.
    'e18e/prefer-regex-test': 'off',
    'e18e/prefer-timer-args': 'off',
  },
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': ['error', { settings: {
      shellEmulator: true,
      trustPolicy: 'no-downgrade',
    } }],
  },
})
