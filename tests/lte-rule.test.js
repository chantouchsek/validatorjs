import Validator from '../src'

describe('lte validation rule', function() {
  it('should fail when value is too big.', function() {
    const validator = new Validator({
      input: {
        age: 2,
        bar: 1,
      },
      rules: {
        age: 'lte:bar',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should pass when value is smaller', function() {
    const validator = new Validator({
      input: {
        age: 2,
        bar: 3,
      },
      rules: {
        age: 'lte:bar',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when value is equeal', function() {
    const validator = new Validator({
      input: {
        age: 2,
        bar: 2,
      },
      rules: {
        age: 'lte:bar',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when values are not numbers', function() {
    const validator = new Validator({
      input: {
        age: 'foo',
        bar: 'something',
      },
      rules: {
        age: 'lte:bar',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
