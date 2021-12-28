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

  it('should pass on multiple async rules', (done) => {
    let passCount = 0

    Validator.registerAsync(
      'username1',
      (input: string, value: string, attribute: string, passes: any) => {
        setTimeout(() => {
          if (input == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    Validator.registerAsync(
      'username2',
      (input: string, value: string, attribute: string, passes: any) => {
        setTimeout(() => {
          if (input == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      { username: 'test' },
      { username: 'username1|username2' },
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
      (input: string, value: string, attribute: string, passes: any) => {
        setTimeout(() => {
          if (input == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    Validator.registerAsync(
      'username2',
      (input: string, value: string, attribute: string, passes: any) => {
        setTimeout(() => {
          if (input == 'test') {
            failedCount++
            passes(false)
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      { username: 'test' },
      { username: 'username1|username2' },
    )
    validator.fails(() => {
      expect(passCount).toEqual(1)
      expect(failedCount).toEqual(1)
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
      (input: string, value: any, attribute: string, passes: any) => {
        setTimeout(() => {
          if (input == 'test') {
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      { username: 'test' },
      { username: 'required|min:3|username' },
    )
    validator.passes(done)
  })

  it('should it not call passes if using just fails callback', (done) => {
    const validator = new Validator({ name: 'gary' }, { name: 'required' })
    validator.fails(() => {
      throw 'Should not be called.'
    })

    validator.passes(() => {
      done()
    })
  })

  it('should it not call fails if using just passes callback', (done) => {
    const validator = new Validator({ name: '' }, { name: 'required' })
    validator.passes(() => {
      throw 'Should not be called.'
    })

    validator.fails(() => {
      done()
    })
  })

  // it('should throw exception when attempting to validate and no fail or pass callback', function () {
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   Validator.registerAsync('username', function () {})
  //   const validator = new Validator(
  //     { username: 'admin' },
  //     { username: 'username' },
  //   )
  //   // validator.passes()
  //   expect(validator.passes).toThrow(/^passes expects.*/)
  // })
})
