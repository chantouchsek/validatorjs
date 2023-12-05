import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('boolean validation rule', () => {
  it('should pass with a boolean value', () => {
    const validator = new Validator({ isHappy: true }, { isHappy: 'boolean' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a decimal boolean value', () => {
    const validator = new Validator({ isHappy: 1, isSad: 0 }, { isHappy: 'boolean', isSad: 'boolean' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string boolean value', () => {
    const validator = new Validator(
      { firstOne: 'true', fourthOne: '1', secondOne: 'false', thirdOne: '0' },
      {
        firstOne: 'boolean',
        fourthOne: 'boolean',
        secondOne: 'boolean',
        thirdOne: 'boolean',
      },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with an incorrect string value', () => {
    const validator = new Validator({ firstOne: 'truee' }, { firstOne: 'boolean' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with no value', () => {
    const validator = new Validator({}, { age: 'boolean' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass with an empty string value', () => {
    const validator = new Validator({ age: '' }, { age: 'boolean' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
