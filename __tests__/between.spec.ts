import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('between rule', () => {
  it('should pass between rule when 25 and between 18 - 30', () => {
    const validator = new Validator({ num: 25 }, { num: 'between:18,30' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass between rule when 25 and between 25 - 30', () => {
    const validator = new Validator({ num: 25 }, { num: 'between:25,30' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail on string 25 when between is set to 25 - 30', () => {
    const validator = new Validator({ num: '25' }, { num: 'between:25,30' })
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass on string 25 when between is set to 2 - 3', () => {
    const validator = new Validator(
      { num: '25' },
      {
        num: 'between:2,3',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should threat string 25 as numeric when other numeric rules are set and pass when between is set to 25 - 30', () => {
    const validator = new Validator({ num: '25' }, { num: 'between:25,30|numeric' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should support floats', () => {
    const validator = new Validator(
      { num1: 25.12, num2: 0.03 },
      { num1: 'between:25.11,25.13', num2: 'between:0.02,0.04' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should support unsigned', () => {
    const validator = new Validator({ num: -3 }, { num: 'between:-4,-2' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should support array', () => {
    const validator = new Validator({ array2: ['a', 'b'] }, { array2: 'required|between:1,2' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should generate proper error message for numeric field', () => {
    const validator = new Validator({ num: 14 }, { num: 'between:16,23' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('num')).toEqual('The num must be between 16 and 23.')
  })

  it('should generate proper error message for string field (characters)', () => {
    const validator = new Validator({ name: 'mike erickson' }, { name: 'between:1,4' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toEqual('The name must be between 1 and 4 characters.')
  })

  it('should fail when passed invalid values', () => {
    const validator = new Validator(
      {
        numNull: null,
        numUndefined: undefined,
        numEmpty: '',
        numOutOfBounds: 24,
        numOutOfBoundsUnsigned: -34,
      },
      {
        numNull: 'between:25,30',
        numUndefined: 'between:25,30',
        numEmpty: 'between:25,30',
        numOutOfBounds: 'between:25,30',
        numOutOfBoundsUnsigned: 'between:-35,150',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })
})
