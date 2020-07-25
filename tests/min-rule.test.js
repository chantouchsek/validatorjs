import Validator from '../src'

describe('min validation rule', function() {
  it('should fail with the name "D". Minimum size is 2 letters.', function() {
    const validator = new Validator({
      input: {
        name: 'D',
      },
      rules: {
        name: 'min:2',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should pass with the name "Da". Minimum is 2 letters.', function() {
    const validator = new Validator({
      input: {
        name: 'Da',
      },
      rules: {
        name: 'min:2',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the age "18". Minimum is 18.', function() {
    const validator = new Validator({
      input: {
        age: 18,
      },
      rules: {
        age: 'min:18',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the age "17". Minimum is 18.', function() {
    const validator = new Validator({
      input: {
        age: 17,
      },
      rules: {
        age: 'min:18',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with value of 0.04', function() {
    const validator = new Validator({
      input: {
        val: 0.04,
      },
      rules: {
        val: 'min:0.05',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with boolean true value', function() {
    const validator = new Validator({
      input: {
        val: true,
      },
      rules: {
        val: 'min:0.05',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with boolean false value', function() {
    const validator = new Validator({
      input: {
        val: false,
      },
      rules: {
        val: 'min:0.05',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with an undefined value', function() {
    const validator = new Validator({
      input: {},
      rules: {
        val: 'min:0.05',
      },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an empty string value', function() {
    const validator = new Validator({
      input: {
        val: '',
      },
      rules: {
        val: 'min:0.05',
      },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when given string-integer value', function() {
    const validator = new Validator({
      input: {
        val: '18',
      },
      rules: {
        val: 'integer|min:16',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when given string-float value', function() {
    const validator = new Validator({
      input: {
        val: '17.56',
      },
      rules: {
        val: 'numeric|min:17.5',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
