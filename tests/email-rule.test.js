import Validator from '../src'

describe('email validation rule', function() {
  it('should pass with the email address: johndoe@gmail.com', function() {
    const validator = new Validator({
      input: {
        email: 'johndoe@gmail.com',
      },
      rules: {
        email: 'email',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the email address: johndoe.gmail.com', function() {
    const validator = new Validator({
      input: {
        email: 'johndoe.gmail.com',
      },
      rules: {
        email: 'email',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with the email address: johndoe@gmail', function() {
    const validator = new Validator({
      input: {
        email: 'johndoe@gmail',
      },
      rules: {
        email: 'email',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when the email address contains whitespace only and is required', function() {
    const validator = new Validator({
      input: {
        email: '   ',
      },
      rules: {
        email: 'required|email',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when the field is an empty string', function() {
    const validator = new Validator({
      input: {
        email: '',
      },
      rules: {
        email: 'email',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', function() {
    const validator = new Validator({
      input: {},
      rules: {
        email: 'email',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass with first.last@example.com', function() {
    const validator = new Validator({
      input: {
        email: 'first.last@example.com',
      },
      rules: {
        email: 'email',
      },
    })

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
