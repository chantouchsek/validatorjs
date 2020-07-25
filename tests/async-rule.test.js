import Validator from '../src'

describe('async rule tests', function() {
  // this.timeout(200)

  it('should be able to register and pass async rule', function(done) {
    const validator = new Validator()
    validator.registerAsync('username', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')
    validator.setOptions({
      input: { username: 'test' },
      rules: { username: 'username' },
    })
    validator.passes(done)
  })


  it('should be able to fail async rules', function(done) {
    const validator = new Validator()
    validator.registerAsync('username', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passes(false)
        }
      }, 50)
    }, ':attribute is an invalid username')

    validator.setOptions({
      input: { username: 'test' },
      rules: { username: 'username' },
    })
    validator.fails(done)
  })

  it('should pass on multiple async rules', function(done) {
    let passCount = 0
    const validator = new Validator()
    validator.registerAsync('username1', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passCount++
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')

    validator.registerAsync('username2', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passCount++
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')
    validator.setOptions({
      input: { username: 'test' },
      rules: { username: 'username1|username2' },
    })
    validator.passes(function() {
      expect(passCount).toEqual(2)
      done()
    })
  })

  it('should fail on mixture of pass/fail async rules', function(done) {
    let failedCount = 0
    let passCount = 0
    const validator = new Validator()
    validator.registerAsync('username1', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passCount++
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')

    validator.registerAsync('username2', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          failedCount++
          passes(false)
        }
      }, 50)
    }, ':attribute is an invalid username')
    validator.setOptions({
      input: { username: 'test' },
      rules: { username: 'username1|username2' },
    })
    validator.fails(function() {
      expect(passCount).toEqual(1)
      expect(failedCount).toEqual(1)
      done()
    })
  })

  it('should allow custom error message', function(done) {
    const validator = new Validator()
    validator.registerAsync('username', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'admin') {
          passes(false, 'This username is banned')
        }
      }, 50)
    }, ':attribute is an invalid username')
    validator.setOptions({
      input: { username: 'admin' },
      rules: { username: 'username' },
    })
    validator.fails(function() {
      expect(validator.errors.first('username')).toEqual('This username is banned')
      done()
    })
  })

  it('should allow validating by async when no async rules', function(done) {
    const validator = new Validator({
      input: {
        username: 'admin',
        email: 'blah',
      },
      rules: {
        username: 'required|min:3',
        email: 'required|email',
      },
    })
    validator.fails(function() {
      done()
    })

    validator.passes(function() {
      throw 'Should not have passed.'
    })
  })

  it('should it pass on mixture of sync/async rules', function(done) {
    const validator = new Validator()
    validator.registerAsync('username', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')
    validator.setOptions({
      input: { username: 'test' },
      rules: { username: 'required|min:3|username' },
    })
    validator.passes(done)
  })

  it('should it not call passes if using just fails callback', function(done) {
    const validator = new Validator({
      input: {
        name: 'gary',
      },
      rules: {
        name: 'required',
      },
    })
    validator.fails(function() {
      throw 'Should not be called.'
    })
    validator.passes(function() {
      done()
    })
  })

  it('should it not call fails if using just passes callback', function(done) {
    const validator = new Validator({
      input: {
        name: '',
      },
      rules: {
        name: 'required',
      },
    })
    validator.passes(function() {
      throw 'Should not be called.'
    })

    validator.fails(function() {
      done()
    })
  })

  // it('should throw exception when attempting to validate and no fail or pass callback', function() {

  // 	Validator.registerAsync('username', function() { });
  // 	var validator = new Validator({ username: 'admin' }, { username: 'username' });
  // 	expect(validator.passes).to.throw(/^passes expects.*/);

  // });

})
