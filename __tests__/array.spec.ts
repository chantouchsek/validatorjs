import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('array rule', () => {
  it('should pass when array', () => {
    const validator = new Validator({ users: [] }, { users: 'array' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail when given object', () => {
    const validator = new Validator({ users: {} }, { users: 'array' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should fail when given boolean', () => {
    const validator = new Validator({ users: true }, { users: 'array' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should have a minimum number of array items ', () => {
    const validator = new Validator(
      {
        names: [],
      },
      {
        names: 'array|min:1',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })
})
