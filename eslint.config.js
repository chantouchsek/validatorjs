import config from '@antfu/eslint-config'

export default config({}, {
  rules: {
    'perfectionist/sort-array-includes': [
      'error',
      {
        'order': 'asc',
        'spread-last': true,
        'type': 'natural',
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
        'custom-groups': {
          id: 'id',
        },
        'groups': ['id', 'unknown'],
        'order': 'asc',
        'partition-by-comment': 'Part:**',
        'type': 'natural',
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
