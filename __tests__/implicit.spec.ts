import Validator from '../src/main'

describe('implicit rule tests', () => {
  it('should fail implicit rule even when undefined', () => {
    Validator.registerImplicit(
      'null_or_number',
      (val: string) => {
        return (val && val.match(/^\d*$/)) || val === null
      },
      ':attribute must be a number or empty',
    )

    const validator = new Validator(
      {
        /* empty */
      },
      { value: 'null_or_number' },
    )
    expect(validator.passes()).toBeFalsy()
  })

  it('should pass implicit rule even when null', () => {
    Validator.registerImplicit(
      'null_or_number',
      (val: string) => (val && val.match(/^\d*$/)) || val === null,
      ':attribute must be a number or empty',
    )

    const validator = new Validator({ value: null }, { value: 'null_or_number' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail async implicit rule even when undefined', function (done) {
    Validator.registerAsyncImplicit(
      'async_null',
      (value: string, attribute: string, req: number, passes: any) => {
        setTimeout(() => {
          if (value === null) {
            passes(true)
          } else {
            passes(false)
          }
        }, 50)
      },
      ':attribute already taken',
    )

    const validator = new Validator(
      {
        /* empty */
      },
      { value: 'async_null' },
    )
    validator.fails(done)
  })

  it('should pass async implicit rule even when null', function (done) {
    Validator.registerAsyncImplicit(
      'async_null',
      (value: string, attribute: string, req: number, passes: any) => {
        setTimeout(() => {
          if (value === null) {
            passes(true)
          } else {
            passes(false)
          }
        }, 50)
      },
      ':attribute already taken',
    )

    const validator = new Validator({ value: null }, { value: 'async_null' })
    validator.passes(done)
  })
})
