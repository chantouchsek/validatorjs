import Validator from '../src/main'

describe('different validation rule', () => {
  it('should fail when the 2 attributes are the same', () => {
    const validator = new Validator(
      { field1: 'abc', field2: 'abc' },
      { field2: 'different:field1' },
    )
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when the 2 attributes are different', () => {
    const validator = new Validator(
      { field1: 'abc', field2: 'abcd' },
      { field2: 'different:field1' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass if one of the 2 attributes is a nested path', () => {
    const validator = new Validator(
      {
        payload: {
          pw: 'abc123',
          username: 'test123',
        },
        username: 'test',
      },
      { username: 'different:payload.username' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail if one of the 2 attributes is an invalid nested path', () => {
    const validator = new Validator(
      {
        payload: {
          pw: 'abc123',
          username: 'test123',
        },
        username: 'test123',
      },
      {
        username: 'different:payload.username',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('username')).toEqual(
      'The username and payload.username must be different.',
    )
  })
})
