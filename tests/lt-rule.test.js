import Validator from '../src'

describe('lt validation rule', function() {
  it('should fail when value is too big.', function() {
    const validator = new Validator({
      input: {
        age: 2,
        bar: 1,
      },
      rules: {
        age: 'lt:bar',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail when value is equal', function() {
    const validator = new Validator({
      input: {
        age: 2,
        bar: 2,
      },
      rules: {
        age: 'lt:bar',
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
        age: 'lt:bar',
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
        age: 'lt:bar',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
