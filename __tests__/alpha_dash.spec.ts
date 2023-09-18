import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('alpha_dash validation rule', () => {
  it('should fail with non alpha dash characters', () => {
    const validator = new Validator({ name: 'David *' }, { name: 'alpha_dash' })
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with non-alphabetic characters', () => {
    const validator = new Validator({ name: 12 }, { name: 'alpha_dash' })
    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with only alpha dash characters', () => {
    const validator = new Validator({ name: 'David9_-' }, { name: 'alpha_dash' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass when the field is blank / optional', () => {
    const validator = new Validator({ name: '' }, { name: 'alpha_dash' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', () => {
    const validator = new Validator({}, { name: 'alpha_dash' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
