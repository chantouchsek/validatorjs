import Validator from '../src'

describe('alpha_num validation rule', function() {
  it('should fail with non-alphanumeric characters', function() {
    const validator = new Validator({
      input: {
        age: '$',
      },
      rules: {
        age: 'alpha_num',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('age')).toEqual('The age field must be alphanumeric.')
  })

  it('should pass with only alphanumeric characters', function() {
    const validator = new Validator({
      input: {
        age: 'abc123',
      },
      rules: {
        age: 'alpha_num',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass with only numeric characters', function() {
    const validator = new Validator({
      input: {
        age: 123,
      },
      rules: {
        age: 'alpha_num',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the field is blank / optional', function() {
    const validator = new Validator({
      input: {
        name: '',
      },
      rules: {
        name: 'alpha_num',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', function() {
    const validator = new Validator({
      input: {},
      rules: {
        name: 'alpha_num',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
