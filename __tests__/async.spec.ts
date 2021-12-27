import Validator from '../src/main'

describe('async rule tests', () => {
  jest.setTimeout(200)

  it('should be able to register and pass async rule', (done) => {
    Validator.registerAsync(
      'username',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username',
      },
    )
    validator.passes(done)
  })

  it.skip('should be able to fail async rules', (done) => {
    Validator.registerAsync(
      'username',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passes(false)
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username',
      },
    )
    validator.fails(done)
  })

  it('should pass on multiple async rules', (done) => {
    let passCount = 0

    Validator.registerAsync(
      'username1',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    Validator.registerAsync(
      'username2',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username1|username2',
      },
    )
    validator.passes(() => {
      expect(passCount).toEqual(2)
      done()
    })
  })

  it('should fail on mixture of pass/fail async rules', (done) => {
    let failedCount = 0
    let passCount = 0

    Validator.registerAsync(
      'username1',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    Validator.registerAsync(
      'username2',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            failedCount++
            passes(false)
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username1|username2',
      },
    )
    validator.fails(() => {
      expect(passCount).toEqual(1)
      expect(failedCount).toEqual(1)
      done()
    })
  })

  it.skip('should allow custom error message', (done) => {
    Validator.registerAsync(
      'username',
      (
        desiredUsername: string,
        ruleValue: string,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'admin') {
            passes(false, 'This username is banned')
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'admin',
      },
      {
        username: 'username',
      },
    )
    validator.fails(() => {
      expect(validator.errors.first('username')).toEqual(
        'This username is banned',
      )
      done()
    })
  })

  it('should allow validating by async when no async rules', (done) => {
    const validator = new Validator(
      {
        username: 'admin',
        email: 'blah',
      },
      {
        username: 'required|min:3',
        email: 'required|email',
      },
    )
    validator.fails(() => {
      done()
    })

    validator.passes(() => {
      throw 'Should not have passed.'
    })
  })

  it('should it pass on mixture of sync/async rules', (done) => {
    Validator.registerAsync(
      'username',
      (
        desiredUsername: string,
        ruleValue: any,
        attribute: string,
        passes: any,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'required|min:3|username',
      },
    )
    validator.passes(done)
  })

  it('should it not call passes if using just fails callback', (done) => {
    const validator = new Validator(
      {
        name: 'gary',
      },
      {
        name: 'required',
      },
    )
    validator.fails(() => {
      throw 'Should not be called.'
    })

    validator.passes(() => {
      done()
    })
  })

  it('should it not call fails if using just passes callback', (done) => {
    const validator = new Validator(
      {
        name: '',
      },
      {
        name: 'required',
      },
    )
    validator.passes(() => {
      throw 'Should not be called.'
    })

    validator.fails(() => {
      done()
    })
  })

  // it('should throw exception when attempting to validate and no fail or pass callback', function() {

  // 	Validator.registerAsync('username', function() { });
  // 	var validator = new Validator({ username: 'admin' }, { username: 'username' });
  // 	expect(validator.passes).to.throw(/^passes expects.*/);

  // });
})
