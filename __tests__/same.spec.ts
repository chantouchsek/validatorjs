import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('same validation rule', () => {
  it('should fail when the 2 attributes are different', () => {
    const validator = new Validator(
      {
        pw: 'abc123',
        pw2: 'abc1234',
      },
      {
        pw2: 'same:pw',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('pw2')).toEqual('The pw2 and pw fields must match.')
  })

  it('should fail when the the comparing attribute doesnt exist', () => {
    const validator = new Validator(
      {
        pw2: 'abc1234',
      },
      {
        pw2: 'same:pw',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('pw2')).toEqual('The pw2 and pw fields must match.')
  })

  it('should pass when the 2 attributes are equal', () => {
    const validator = new Validator(
      {
        pw: 'abc123',
        pw2: 'abc123',
      },
      {
        pw2: 'same:pw',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass if one of the 2 attributes is a nested path', () => {
    const validator = new Validator(
      {
        payload: {
          pw: 'abc123',
          username: 'test',
        },
        username: 'test',
      },
      {
        username: 'same:payload.username',
      },
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
        username: 'test',
      },
      {
        username: 'same:payload.username',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('username')).toEqual('The username and payload username fields must match.')
  })
})
