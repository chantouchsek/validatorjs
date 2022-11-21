import Validator from '../src/main'

describe('_onlyInputWithRules()', () => {
  it('should return only attributes defined in the rules', () => {
    const validator = new Validator(
      {
        email: 'test1@example.com',
        addresses: [
          {
            line1: '934 High Noon St. Ronkonkoma, NY 1177',
            zip: 1177,
          },
          {
            line1: '476 Main St. Clinton Township',
            line2: 'MI 48035',
            zip: 48035,
          },
        ],
        additional_field1: 'lorem_ipsum',
        additional_field2: 'lorem_ipsum',
      },
      {
        email: 'required|string|email',
        'addresses.*.line1': 'required|string|max:200',
        'addresses.*.line2': 'nullable|string|max:200',
      },
    )

    const validated = validator._onlyInputWithRules()

    expect(validated).toEqual({
      email: 'test1@example.com',
      addresses: [
        {
          line1: '934 High Noon St. Ronkonkoma, NY 1177',
        },
        {
          line1: '476 Main St. Clinton Township',
          line2: 'MI 48035',
        },
      ],
    })
    expect(validated).toHaveProperty('email')
    expect(validated).toHaveProperty('addresses')
    expect(validated).not.toHaveProperty('additional_field1')
    expect(validated).not.toHaveProperty('additional_field2')
    expect(validated.addresses[0]).toHaveProperty('line1')
    expect(validated.addresses[0]).not.toHaveProperty('line2')
    expect(validated.addresses[0]).not.toHaveProperty('zip')
    expect(validated.addresses[1]).toHaveProperty('line1')
    expect(validated.addresses[1]).toHaveProperty('line2')
    expect(validated.addresses[1]).not.toHaveProperty('zip')
  })
})

describe('validated()', () => {
  beforeAll(() => {
    Validator.registerAsync(
      'not_dustin',
      function (username: string, attribute: string, req: number, passes: any) {
        setTimeout(function () {
          if (username === 'dustin') {
            passes(false)
          } else {
            passes()
          }
        }, 1000)
      },
      'The :attribute can not be Dustin.',
    )
  })

  it('should return only attributes defined in the rules (normal)', () => {
    const validator = new Validator(
      {
        user: 'John Doe',
        additional_field1: 'lorem_ipsum',
        additional_field2: 'lorem_ipsum',
      },
      { user: 'string' },
    )

    const validated = validator.validated()

    expect(validated).toEqual({ user: 'John Doe' })
    expect(validated).toHaveProperty('user')
    expect(validated).not.toHaveProperty('additional_field1')
    expect(validated).not.toHaveProperty('additional_field2')
  })

  it('should return only attributes defined in the rules (async)', (done) => {
    const validator = new Validator(
      {
        user: 'John Doe',
        additional_field1: 'lorem_ipsum',
        additional_field2: 'lorem_ipsum',
      },
      { user: 'not_dustin' },
    )

    validator.validated(
      function (validated) {
        expect(validated).toEqual({ user: 'John Doe' })
        expect(validated).toHaveProperty('user')
        expect(validated).not.toHaveProperty('additional_field1')
        expect(validated).not.toHaveProperty('additional_field2')
        done()
      },
      function () {
        throw new Error("fails callback shouldn't be called!")
      },
    )
  })

  it('should throw an Error when current validation fails (normal)', () => {
    const validator = new Validator({ user: 'John Doe' }, { user: 'min:20' })

    expect(validator.validated.bind(validator)).toThrow('Validation failed!')
  })

  it('should throw an Error when current validation fails (async)', (done) => {
    const validator = new Validator({ user: 'dustin' }, { user: 'not_dustin' })

    validator.validated(
      function () {
        throw new Error("passes callback shouldn't be called!")
      },
      function () {
        expect(validator.errors.first('user')).toEqual('The user can not be Dustin.')
        done()
      },
    )
  })
})
