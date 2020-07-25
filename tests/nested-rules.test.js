import Validator from '../src'

describe('nested validation rules', function() {
  const nestedObject = {
    name: 'required',
    data: {
      weight: 'required',
      hair: {
        color: 'required',
      },
    },
  }

  const nestedFlatten = {
    name: 'required',
    'data.weight': 'required',
    'data.hair.color': 'required',
  }

  const dataPass = {
    name: 'David',
    data: {
      weight: 70,
      hair: {
        color: 'black',
      },
    },
  }

  const failAsserts = [
    [{}, {
      name: 'The name field is required.',
      'data.weight': 'The data.weight field is required.',
      'data.hair.color': 'The data.hair.color field is required.',
    }],
    [{ name: 'David' }, {
      'data.weight': 'The data.weight field is required.',
      'data.hair.color': 'The data.hair.color field is required.',
    }],
    [{ data: { weight: 70 } }, {
      name: 'The name field is required.',
      'data.hair.color': 'The data.hair.color field is required.',
    }],
    [{ data: { hair: { color: 'black' } } }, {
      name: 'The name field is required.',
      'data.weight': 'The data.weight field is required.',
    }],
  ]

  it('should pass with validation rules nested object', function() {
    const validator = new Validator({
      input: dataPass,
      rules: nestedObject,
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail with validation rules nested object', function() {
    failAsserts.forEach(function(assert) {
      const validator = new Validator({
        input: assert[0],
        rules: nestedObject,
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.fails()).toBeTruthy()
      Object.keys(assert[1]).forEach(function(key) {
        expect(validator.errors.first(key)).toEqual(assert[1][key])
      })
    })
  })

  it('should pass with validation rules flatten object', function() {
    const validator = new Validator({
      input: dataPass,
      rules: nestedFlatten,
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail with validation rules flatten object', function() {
    failAsserts.forEach(function(assert) {
      const validator = new Validator({ input: assert[0], rules: nestedFlatten })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.fails()).toBeTruthy()
      Object.keys(assert[1]).forEach(function(key) {
        expect(validator.errors.first(key)).toEqual(assert[1][key])
      })
    })
  })
})
