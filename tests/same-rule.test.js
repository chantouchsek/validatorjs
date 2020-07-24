import Validator from '../src'

describe('same validation rule', function() {
  it('should fail when the 2 attributes are different', function() {
    const validator = new Validator({
      input: {
        pw: 'abc123',
        pw2: 'abc1234',
      },
      rules: {
        pw2: 'same:pw',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('pw2')).toEqual('The pw2 and pw fields must match.')
  })

  it('should fail when the the comparing attribute doesnt exist', function() {
    const validator = new Validator({
      input: {
        pw2: 'abc1234',
      },
      rules: {
        pw2: 'same:pw',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('pw2')).toEqual('The pw2 and pw fields must match.')
  })

  it('should pass when the 2 attributes are equal', function() {
    const validator = new Validator({
      input: {
        pw: 'abc123',
        pw2: 'abc123',
      },
      rules: {
        pw2: 'same:pw',
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
          username: 'test',
        },
        username: 'test',
      },
      rules: {
        username: 'same:payload.username',
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
        username: 'test',
      },
      rules: {
        username: 'same:payload.username',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('username')).toEqual('The username and payload.username fields must match.')
  })
})
