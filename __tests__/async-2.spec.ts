import Validator from '../src/main'

describe('async rule tests', () => {
  jest.setTimeout(200)

  it('should allow custom error message', (done) => {
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

    const validator = new Validator(
      { username: 'admin' },
      { username: 'username' },
    )
    validator.fails(() => {
      expect(validator.errors.first('username')).toEqual(
        'This username is banned',
      )
      done()
    })
  })
})
