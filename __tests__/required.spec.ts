import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('required validation pass rules', () => {
  it('should pass with non-empty strings', () => {
    const validator = new Validator({ name: 'David' }, { name: 'required' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with empty strings', () => {
    const validator = new Validator({ email: '' }, { email: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with strings containing only white space', () => {
    const validator = new Validator({ name: '' }, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when a value is equal to undefined', () => {
    const validator = new Validator({ name: undefined }, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when a value is equal to null', () => {
    const validator = new Validator({ name: null }, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when a value is numeric', () => {
    const validator = new Validator(
      {
        age: 29,
      },
      {
        age: 'required',
      },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when the attribute is not passed in', () => {
    const validator = new Validator(
      {},
      {
        email: 'required',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should fail when the array is empty', () => {
    const validator = new Validator({ users: [] }, { users: 'required|array' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should not fail when not an empty array', () => {
    const validator = new Validator({ users: [false] }, { users: 'required|array' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
