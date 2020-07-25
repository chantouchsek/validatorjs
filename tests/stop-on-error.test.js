import Validator from '../src'

describe('stopOnError tests', function() {
  it('synchronous', function() {
    const validator = new Validator({
      input: {
        email: 'x',
      },
      rules: {
        email: 'min:1|email',
      },
    })
    validator.stopOnError(true)
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('email')).toHaveLength(1)
  })

  /* it('asynchronous', function(done) {

    Validator.registerAsync('username_available', function(val, ruleValue, attribute, passes) {
      throw 'Should not have been called.'
    })
    var validator = new Validator({ email: 'x' }, { email: 'email|username_available' })
    validator.stopOnError(true)
    validator.fails(function() {
      expect(validator.errors.get('email')).to.have.length(1)
      done()
    })

  }) */

  it('only certain fields', function() {
    const validator = new Validator({
      input: {
        email1: 'x',
        email2: 'x',
      },
      rules: {
        email1: 'min:5|email',
        email2: 'min:5|email',
      },
    })
    validator.stopOnError(['email2'])
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('email1')).toHaveLength(2)
    expect(validator.errors.get('email2')).toHaveLength(1)
  })

  it('should allow globally setting whether to stop on error', function() {
    const validator = new Validator()
    validator.stopOnError(true)
    validator.setOptions({
      input: {
        email: 'x',
      },
      rules: {
        email: 'min:5|email',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('email')).toHaveLength(1)
    validator.stopOnError(false)
  })

  it('should always stop if field is implicit and cannot be validated', function() {
    const validator = new Validator({input:{
      email: '',
    },
    rules:{
      email: 'required|email',
    }})
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('email')).toHaveLength(1)
  })
})
