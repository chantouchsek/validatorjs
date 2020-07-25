import Validator from '../src'

describe('passes()', function() {
  it('should not duplicate error messages when called multiple times', function() {
    const validator = new Validator({
      input: {},
      rules: {
        login: 'required',
      },
    })

    validator.passes()
    validator.passes()

    expect(validator.errors.all()).toEqual({
      login: [
        'The login field is required.',
      ],
    })
  })

  it('should work if the input doesn\'t extend Object', function() {
    // This happens in Express's req.body, for example.
    const input = Object.create(null)
    input.a = 2
    const validator = new Validator({
      input,
      rules: { 'a': 'required' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
