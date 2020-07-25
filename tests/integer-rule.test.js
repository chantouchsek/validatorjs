import Validator from '../src'

describe('integer pass rules', function() {
  it('should pass if no value is entered', function() {
    const validator = new Validator({
      input: {},
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an integer value', function() {
    const validator = new Validator({
      input: {
        age: 18,
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string containing an integer value', function() {
    const validator = new Validator({
      input: {
        age: '18',
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with unsigned integer', function() {
    const validator = new Validator({
      input: {
        num: -123,
      },
      rules: {
        num: 'integer',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

})

describe('integer fail rules', function() {

  it('should fail with a decimal value', function() {
    const validator = new Validator({
      input: {
        age: 18.9,
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('age')).toEqual('The age must be an integer.')
  })

  it('should fail with a string value containing numbers and letters', function() {
    const validator = new Validator({
      input: {
        age: '18d',
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('age')).toEqual('The age must be an integer.')
  })

  it('should fail with a boolean true value', function() {
    const validator = new Validator({
      input: {
        age: true,
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail with a boolean false value', function() {
    const validator = new Validator({
      input: {
        age: false,
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail if the value is an array', function() {
    const validator = new Validator({
      input: {
        age: [],
      },
      rules: {
        age: 'required|integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail if the value is an object', function() {
    const validator = new Validator({
      input: {
        age: {},
      },
      rules: {
        age: 'integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail with unsigned float-integer', function() {
    const validator = new Validator({
      input: {
        num: -70.36,
      },
      rules: {
        num: 'integer',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })
})
