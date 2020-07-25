import Validator from '../src'

describe('size validation rule', function() {
  it('should fail with the state = C. Size must be 2 letters.', function() {
    const validator = new Validator({
      input: {
        state: 'C',
      },
      rules: {
        state: 'size:2',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the state = CA. Size must be 2 letters.', function() {
    const validator = new Validator({
      input: {
        state: 'CA',
      },
      rules: {
        state: 'size:2',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an empty string', function() {
    const validator = new Validator({
      input: {
        state: '',
      },
      rules: {
        state: 'size:2',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the age 65. Size must be 65', function() {
    const validator = new Validator({
      input: {
        age: 65,
      },
      rules: {
        age: 'size:65',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the age 64. Size must be 65.', function() {
    const validator = new Validator({
      input: {
        age: 64,
      },
      rules: {
        age: 'size:65',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when no value exists in the input object', function() {
    const validator = new Validator({
      input: {},
      rules: {
        age: 'size:65',
      },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with string-integer', function() {
    const validator = new Validator({
      input: {
        age: '65',
      },
      rules: {
        age: 'integer|size:65',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with float-integer', function() {
    const validator = new Validator({
      input: {
        age: '65.36',
      },
      rules: {
        age: 'numeric|size:65.36',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
