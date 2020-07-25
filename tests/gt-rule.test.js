import Validator from '../src'

describe('gt validation rule', function() {
  it('should fail when value is too small.', function() {
    const validator = new Validator({
      input: {
        age: 1,
        bar: 2,
      },
      rules: {
        age: 'gt:bar',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail when value is equal.', function() {
    const validator = new Validator({
      input: {
        age: 2,
        bar: 2,
      },
      rules: {
        age: 'gt:bar',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should pass when value is bigger', function() {
    const validator = new Validator({
      input: {
        age: 3,
        bar: 2,
      },
      rules: {
        age: 'gt:bar',
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
        age: 'gt:bar',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
