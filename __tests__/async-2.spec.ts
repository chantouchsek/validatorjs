import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('async rule tests', () => {
  it('should allow custom error message', () =>
    new Promise<void>((done) => {
      Validator.registerAsync(
        'username',
        (input: string, value: string, attribute: string, passes: any) => {
          setTimeout(() => {
            if (input == 'admin') {
              passes(false, 'This username is banned')
            }
          }, 50)
        },
        ':attribute is an invalid username',
      )

      const validator = new Validator({ username: 'admin' }, { username: 'username' })
      validator.fails(() => {
        expect(validator.errors.first('username')).toEqual('This username is banned')
        done()
      })
    }))
})
