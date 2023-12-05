import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'
import type { SimpleObject } from '../src/types'

describe('nested validation rules', () => {
  const nestedObject: any = {
    data: {
      hair: {
        color: 'required',
      },
      weight: 'required',
    },
    name: 'required',
  }

  const nestedFlatten: SimpleObject<string> = {
    'data.hair.color': 'required',
    'data.weight': 'required',
    'name': 'required',
  }

  const dataPass: SimpleObject = {
    data: {
      hair: {
        color: 'black',
      },
      weight: 70,
    },
    name: 'David',
  }

  const failAsserts: SimpleObject[] = [
    [
      {},
      {
        'data.hair.color': 'The data hair color field is required.',
        'data.weight': 'The data weight field is required.',
        'name': 'The name field is required.',
      },
    ],
    [
      { name: 'David' },
      {
        'data.hair.color': 'The data hair color field is required.',
        'data.weight': 'The data weight field is required.',
      },
    ],
    [
      { data: { weight: 70 } },
      {
        'data.hair.color': 'The data hair color field is required.',
        'name': 'The name field is required.',
      },
    ],
    [
      { data: { hair: { color: 'black' } } },
      {
        'data.weight': 'The data weight field is required.',
        'name': 'The name field is required.',
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
    const testVal = 'mainAccountName'
    const validator = new Validator({
      filters: [
        { key: testVal, values: [''] },
        { key: testVal, values: [''] },
      ],
    }, {
      'filters.*.key': ['required', { in: [testVal] }],
      'filters.*.values': ['array', 'required'],
      'filters.*.values.*': `required_if:filters.*.key,${testVal}|string`,
    })
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('filters.1.values.0')).toBe('The filters 1 values 0 field is required when filters 1 key is mainAccountName.')
  })
})
