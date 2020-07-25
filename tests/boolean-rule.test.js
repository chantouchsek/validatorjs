import Validator from '../src'

describe('boolean validation rule', function() {
  it('should pass with a boolean value', function() {
    const validator = new Validator({
      input: {
        isHappy: true,
      },
      rules: {
        isHappy: 'boolean',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a decimal boolean value', function() {
    const validator = new Validator({
      input: {
        isHappy: 1,
        isSad: 0,
      },
      rules: {
        isHappy: 'boolean',
        isSad: 'boolean',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string boolean value', function() {
    const validator = new Validator({
      input: {
        firstOne: 'true',
        secondOne: 'false',
        thirdOne: '0',
        fourthOne: '1',
      },
      rules: {
        firstOne: 'boolean',
        secondOne: 'boolean',
        thirdOne: 'boolean',
        fourthOne: 'boolean',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with an incorrect string value', function() {
    const validator = new Validator({
      input: {
        firstOne: 'truee',
      },
      rules: {
        firstOne: 'boolean',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with no value', function() {
    const validator = new Validator({
      input: {},
      rules: {
        age: 'boolean',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass with an empty string value', function() {
    const validator = new Validator({
      input: {
        age: '',
      },
      rules: {
        age: 'boolean',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
