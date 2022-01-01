import Validator from '../src/main'

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
    name: 'required',
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
        name: 'The name field is required.',
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
        name: 'The name field is required.',
        'data.hair.color': 'The data hair color field is required.',
      },
    ],
    [
      { data: { hair: { color: 'black' } } },
      {
        name: 'The name field is required.',
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
      Object.keys(assert[1]).forEach(function (key) {
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
      Object.keys(assert[1]).forEach(function (key) {
        const obj = assert[1][key]
        expect(validator.errors.first(key)).toEqual(obj)
      })
    }
  })
}) // Page constructor
