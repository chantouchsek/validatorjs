import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

const PANE_KEY = {
  MAIN_ACCOUNT_NAME: 'mainAccountName',
} as const

describe('nested validation rules', () => {
  const nestedObject: any = {
    name: 'required',
    data: {
      weight: 'required',
      hair: {
        color: 'required',
      },
    },
  }

  const nestedFlatten: Record<string, string> = {
    'name': 'required',
    'data.weight': 'required',
    'data.hair.color': 'required',
  }

  const dataPass: Record<string, any> = {
    name: 'David',
    data: {
      weight: 70,
      hair: {
        color: 'black',
      },
    },
  }

  const failAsserts: Record<string, any>[] = [
    [
      {},
      {
        'name': 'The name field is required.',
        'data.weight': 'The data weight field is required.',
        'data.hair.color': 'The data hair color field is required.',
      },
    ],
    [
      { name: 'David' },
      {
        'data.weight': 'The data weight field is required.',
        'data.hair.color': 'The data hair color field is required.',
      },
    ],
    [
      { data: { weight: 70 } },
      {
        'name': 'The name field is required.',
        'data.hair.color': 'The data hair color field is required.',
      },
    ],
    [
      { data: { hair: { color: 'black' } } },
      {
        'name': 'The name field is required.',
        'data.weight': 'The data weight field is required.',
      },
    ],
  ]

  it('should pass with validation rules nested object', () => {
    const validator = new Validator(dataPass, nestedObject)
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail with validation rules nested object', () => {
    for (const assert of failAsserts) {
      const validator = new Validator(assert[0], nestedObject)
      expect(validator.passes()).toBeFalsy()
      expect(validator.fails()).toBeTruthy()
      Object.keys(assert[1]).forEach((key) => {
        expect(validator.errors.first(key)).toEqual(assert[1][key])
      })
    }
  })

  it('should pass with validation rules flatten object', () => {
    const validator = new Validator(dataPass, nestedFlatten)
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail with validation rules flatten object', () => {
    for (const assert of failAsserts) {
      const validator = new Validator(assert[0], nestedFlatten)
      expect(validator.passes()).toBeFalsy()
      expect(validator.fails()).toBeTruthy()
      Object.keys(assert[1]).forEach((key) => {
        const obj = assert[1][key]
        expect(validator.errors.first(key)).toEqual(obj)
      })
    }
  })
  it('validate on nested array object', () => {
    const validator = new Validator(
      {
        filters: [
          { values: [''], key: PANE_KEY.MAIN_ACCOUNT_NAME },
          { values: [''], key: PANE_KEY.MAIN_ACCOUNT_NAME },
        ],
      }, {
        'filters.*.key': ['required', { in: Object.values(PANE_KEY) }],
        'filters.*.values': ['array', 'required'],
        'filters.*.values.*': `required_if:filters.*.key,${PANE_KEY.MAIN_ACCOUNT_NAME}|string`,
      },
    )
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('filters.1.values.0')).toBe('The filters 1 values 0 field is required when filters 1 key is mainAccountName.')
  })
})
