import Validator from '../src'

describe('numeric validation rule', function() {
  it('should pass with a numeric value', function() {
    const validator = new Validator({
      input: { age: 44 },
      rules: { age: 'numeric' },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should pass with a decimal numeric value', function() {
    const validator = new Validator({
      input: { measurement: 0.4889 },
      rules: { measurement: 'numeric' },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string numeric value', function() {
    const validator = new Validator({
      input: { age: '44' },
      rules: { age: 'numeric' },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string decimal numeric value', function() {
    const validator = new Validator({
      input: { measurement: '0.44' },
      rules: { measurement: 'numeric' },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with a string value', function() {
    const validator = new Validator({
      input: { age: '44something' },
      rules: { age: 'numeric' },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with a boolean true value', function() {
    const validator = new Validator({
      input: { age: true },
      rules: { age: 'numeric' },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with a boolean false value', function() {
    const validator = new Validator({
      input: { age: false },
      rules: { age: 'numeric' },
    })
    expect(validator.fails()).toBeTruthy()
    // expect(validator.errors.first('age')).toEqual('The age must be .')
  })

  it('should pass with no value', function() {
    const validator = new Validator({
      input: {},
      rules: { age: 'numeric' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass with an empty string value', function() {
    const validator = new Validator({
      input: { age: '' },
      rules: { age: 'numeric' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
