import config from '@antfu/eslint-config'

export default config({}, {
  rules: {
    'antfu/if-newline': 'off',
    'curly': 'off',
    'perfectionist/sort-array-includes': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-classes': [
      'error',
      {
        groups: [
          'index-signature',
          'static-property',
          'private-property',
          'property',
          'constructor',
          'static-method',
          'private-method',
          'method',
        ],
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-exports': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-interfaces': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-maps': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-named-imports': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-objects': [
      'error',
      {
        groups: ['id', 'unknown'],
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-union-types': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
  },
})
