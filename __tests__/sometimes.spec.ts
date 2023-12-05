import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('sometimes validation pass rules', () => {
  it('should pass when the property is passed with data', () => {
    const validator = new Validator(
      { firstname: 'Johnny', lastname: 'Appleseed' },
      { firstname: 'required', lastname: 'required|sometimes' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the property is not passed with data', () => {
    const validator = new Validator({ firstname: 'Johnny' }, { firstname: 'required', lastname: 'required|sometimes' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should be able to register and pass async rule when the property is passed with data', () =>
    new Promise<void>((resolve) => {
      Validator.registerAsync(
        'username',
        (desiredUsername: string, ruleValue: string, attribute: string, passes: any) => {
          setTimeout(() => {
            if (desiredUsername === 'test')
              passes()
          }, 50)
        },
        ':attribute is an invalid username',
      )

      const validator = new Validator(
        { email: 'test@example.com', username: 'test' },
        { email: 'email|sometimes', username: 'username' },
      )
      validator.passes(resolve)
    }))

  it('should be able to register and pass async rule when the property is not passed with data', () =>
    new Promise<void>((resolve) => {
      Validator.registerAsync(
        'username',
        (desiredUsername: string, ruleValue: string, attribute: string, passes: any) => {
          setTimeout(() => {
            if (desiredUsername === 'test')
              passes()
          }, 50)
        },
        ':attribute is an invalid username',
      )

      const validator = new Validator({ username: 'test' }, { email: 'email|sometimes', username: 'username' })
      validator.passes(resolve)
    }))

  it('should pass when the nested property is passed with data', () => {
    const validator = new Validator(
      { user: { firstname: 'Johnny', lastname: 'Appleseed' } },
      {
        'user.firstname': 'required',
        'user.lastname': 'sometimes|required|string',
      },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail validation when the nested property is passed with invalid data', () => {
    const validator = new Validator(
      { user: { firstname: 'Johnny', lastname: '' } },
      {
        'user.firstname': 'required',
        'user.lastname': 'sometimes|required|string',
      },
    )
    expect(validator.passes()).toBeFalsy()
  })
})
