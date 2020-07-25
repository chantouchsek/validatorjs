import Validator from '../src'

describe('different validation rule', function() {
  it('should fail when the 2 attributes are the same', function() {
    const validator = new Validator({
      input: {
        field1: 'abc',
        field2: 'abc',
      },
      rules: {
        field2: 'different:field1',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when the 2 attributes are different', function() {
    const validator = new Validator({
      input: {
        field1: 'abc',
        field2: 'abcd',
      },
      rules: {
        field2: 'different:field1',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass if one of the 2 attributes is a nested path', function() {
    const validator = new Validator({
      input: {
        payload: {
          pw: 'abc123',
          username: 'test123',
        },
        username: 'test',
      },
      rules: {
        username: 'different:payload.username',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail if one of the 2 attributes is an invalid nested path', function() {
    const validator = new Validator({
      input: {
        payload: {
          pw: 'abc123',
          username: 'test123',
        },
        username: 'test123',
      },
      rules: {
        username: 'different:payload.username',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('username')).toEqual('The username and payload.username must be different.')
  })
})
