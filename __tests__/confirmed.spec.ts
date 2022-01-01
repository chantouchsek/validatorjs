import Validator from '../src/main'

describe('confirmed validation rule', () => {
  it('should fail without a matching confirmation field for the field under validation', () => {
    const validator = new Validator(
      { password: 'abc' },
      { password: 'confirmed' },
    )
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail without a matching confirmation field for the field under validation', () => {
    const validator = new Validator(
      { password: 'abc', password_confirmation: 'abcd' },
      { password: 'confirmed' },
    )
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('password')).toEqual(
      'The password confirmation does not match.',
    )
  })

  it('should pass with a matching confirmation field for the field under validation', () => {
    const validator = new Validator(
      { password: 'abc', password_confirmation: 'abc' },
      { password: 'confirmed' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should reverse message from confirm to _confirmation', function () {
    const validator = new Validator(
      {
        password: 'abc-1',
        password_confirmation: 'abc',
      },
      { password: 'confirmed' },
      { confirmedReverse: true },
    )
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('password_confirmation')).toEqual(
      'The password confirmation does not match.',
    )
  })

  it('use camelCase of passwordConfirmation property', function () {
    const validator = new Validator(
      {
        form: {
          password: 'abc-1',
          passwordConfirmation: 'abc',
        },
      },
      { form: { password: 'confirmed' } },
      {
        confirmedReverse: true,
        customAttributes: {
          form: {
            password: 'Password',
            passwordConfirmation: 'Password',
          },
        },
      },
    )
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('form.password_confirmation')).toEqual(
      'The Password confirmation does not match.',
    )
  })
})
