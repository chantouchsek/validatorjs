import Validator from '../src'

describe('password rule', function() {
  it('should fail', function() {
    const validator = new Validator({
      input: {
        password: '12345678',
      },
      rules: {
        password: 'password',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('password')).toEqual('The password must be password.')
  })

  it('should pass', function() {
    const validator = new Validator({
      input: {
        password: 'Pa$$w0rd',
      },
      rules: {
        flavour: 'password',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
