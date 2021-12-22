import Validator from '../src'

describe('max validation rule', function() {
  it('should fail with the name "David". Maximum size is 3 letters.', function() {
    const validator = new Validator({
      input: {
        name: 'David',
      },
      rules: {
        name: 'max:3',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should pass with the name "David". Maximum size is 5 letters.', function() {
    const validator = new Validator({
      input: {
        name: 'Da',
      },
      rules: {
        name: 'max:5',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the age "18". Max is 12.', function() {
    const validator = new Validator({
      input: {
        age: 18,
      },
      rules: {
        age: 'max:12',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the age "12". Max is 12.', function() {
    const validator = new Validator({
      input: {
        age: 12,
      },
      rules: {
        age: 'max:12',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with boolean true value', function() {
    const validator = new Validator({
      input: {
        val: true,
      },
      rules: {
        val: 'max:5',
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
        val: 'max:5',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when the age is 0', function() {
    const validator = new Validator({
      input: {
        age: 0,
      },
      rules: {
        age: 'max:2',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the field is an empty string', function() {
    const validator = new Validator({
      input: {
        email: '',
      },
      rules: {
        email: 'max:2',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the field does not exist', function() {
    const validator = new Validator({
      input: {},
      rules: {
        email: 'max:2',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail when given string-integer value', function() {
    const validator = new Validator({
      input: {
        val: '18',
      },
      rules: {
        val: 'integer|max:16',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail when given string-float value', function() {
    const validator = new Validator({
      input: {
        val: '17.56',
      },
      rules: {
        val: 'numeric|max:17.5',
      },
    })
    expect(validator.passes()).toBeFalsy()
  })
})
