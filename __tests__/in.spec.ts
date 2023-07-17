import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('in validation rule', () => {
  it('should fail when the value is not in the set of comma separated values', () => {
    const validator = new Validator({ state: 'fakeState' }, { state: 'in:CA,TX,FL' })
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('state')).toEqual('The selected state is invalid.')
  })

  it('should pass when the value is in the set of comma separated values', () => {
    const validator = new Validator({ state: 'CA' }, { state: 'in:CA,TX,FL' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass when the value is undefined', () => {
    const validator = new Validator({}, { state: 'in:CA,TX,FL' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass when the value is an empty string', () => {
    const validator = new Validator({ state: '' }, { state: 'in:CA,TX,FL' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail when the numeric value is not in the set of comma separated values', () => {
    const validator = new Validator({ quantity: 10 }, { quantity: 'in:0,1,2' })
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('quantity')).toEqual('The selected quantity is invalid.')
  })

  it('should pass when the value is in the set of comma separated values', () => {
    const validator = new Validator({ quantity: 1 }, { quantity: 'in:0,1,2' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass when all values are present', () => {
    const validator = new Validator({ fruits: ['apple', 'strawberry'] }, { fruits: 'array|in:apple,strawberry,kiwi' })

    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when not all values are present', () => {
    const validator = new Validator({ fruits: ['strawberry', 'kiwi'] }, { fruits: 'array|in:apple,strawberry' })

    expect(validator.passes()).toBeFalsy()
  })

  it('should fail when 0 (zero) is not in giving array', function () {
    const validator = new Validator({ quantity: 0 }, { quantity: 'in:1,2' })
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
  })
})
