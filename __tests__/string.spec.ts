import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('string validation rule', () => {
  it('should pass when the input is a string', () => {
    const validator = new Validator({ name: 'David' }, { name: 'string' })

    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when the input is not a string', () => {
    const validator = new Validator({ name: 5 }, { name: 'string' })

    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('name')).toEqual('The name must be a string.')
  })
})
