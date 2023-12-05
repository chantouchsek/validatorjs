import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('async rule tests', () => {
  it('should be able to register and pass async rule', () =>
    new Promise<void>((resolve) => {
      Validator.registerAsync(
        'username',
        (desiredUsername: string, _ruleValue: string, _attribute: string, passes: any) => {
          setTimeout(() => {
            if (desiredUsername === 'test')
              passes()
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
      validator.passes(resolve)
    }))

  it('should pass on multiple async rules', () =>
    new Promise<void>((resolve) => {
      let passCount = 0

      Validator.registerAsync(
        'username1',
        (input: string, _value: string, _attribute: string, passes: any) => {
          setTimeout(() => {
            if (input === 'test') {
              passCount++
              passes()
            }
          }, 50)
        },
        ':attribute is an invalid username',
      )

      Validator.registerAsync(
        'username2',
        (input: string, _value: string, _attribute: string, passes: any) => {
          setTimeout(() => {
            if (input === 'test') {
              passCount++
              passes()
            }
          }, 50)
        },
        ':attribute is an invalid username',
      )

      const validator = new Validator({ username: 'test' }, { username: 'username1|username2' })
      validator.passes(() => {
        expect(passCount).toEqual(2)
        resolve()
      })
    }))

  it('should fail on mixture of pass/fail async rules', () =>
    new Promise<void>((resolve) => {
      let failedCount = 0
      let passCount = 0

      Validator.registerAsync(
        'username1',
        (input: string, _value: string, _attribute: string, passes: any) => {
          setTimeout(() => {
            if (input === 'test') {
              passCount++
              passes()
            }
          }, 50)
        },
        ':attribute is an invalid username',
      )

      Validator.registerAsync(
        'username2',
        (input: string, _value: string, _attribute: string, passes: any) => {
          setTimeout(() => {
            if (input === 'test') {
              failedCount++
              passes(false)
            }
          }, 50)
        },
        ':attribute is an invalid username',
      )

      const validator = new Validator({ username: 'test' }, { username: 'username1|username2' })
      validator.fails(() => {
        expect(passCount).toEqual(1)
        expect(failedCount).toEqual(1)
        resolve()
      })
    }))

  it('should allow validating by async when no async rules', () =>
    new Promise<void>((resolve) => {
      const validator = new Validator(
        {
          email: 'blah',
          username: 'admin',
        },
        {
          email: 'required|email',
          username: 'required|min:3',
        },
      )
      validator.fails(() => {
        resolve()
      })

      validator.passes(() => {
        throw new Error('Should not have passed.')
      })
    }))

  it('should it pass on mixture of sync/async rules', () =>
    new Promise<void>((resolve) => {
      Validator.registerAsync(
        'username',
        (input: string, _value: any, _attribute: string, passes: any) => {
          setTimeout(() => {
            if (input === 'test')
              passes()
          }, 50)
        },
        ':attribute is an invalid username',
      )

      const validator = new Validator({ username: 'test' }, { username: 'required|min:3|username' })
      validator.passes(resolve)
    }))

  it('should it not call passes if using just fails callback', () =>
    new Promise<void>((resolve) => {
      const validator = new Validator({ name: 'gary' }, { name: 'required' })
      validator.fails(() => {
        throw new Error('Should not be called.')
      })

      validator.passes(() => {
        resolve()
      })
    }))

  it('should it not call fails if using just passes callback', () =>
    new Promise<void>((resolve) => {
      const validator = new Validator({ name: '' }, { name: 'required' })
      validator.passes(() => {
        throw new Error('Should not be called.')
      })

      validator.fails(() => {
        resolve()
      })
    }))

  it('should throw exception when attempting to validate and no fail or pass callback', () => {
    Validator.registerAsync('username', () => {})
    const validator = new Validator({ username: 'admin' }, { username: 'username' })
    try {
      validator.passes()
    }
    catch (e) {
      expect(e).instanceOf(Error)
    }
  })
})
