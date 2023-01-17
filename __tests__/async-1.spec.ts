import Validator from '../src/main'

describe('async rule tests', () => {
  it('should be able to fail async rules', (done) => {
    Validator.registerAsync(
      'username',
      (input: string, value: string, attribute: string, passes: any) => {
        setTimeout(() => {
          if (input == 'test') {
            passes(false)
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator({ username: 'test' }, { username: 'username' })
    validator.fails(done)
  })
})
