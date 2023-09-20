import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('nullable validation rule', () => {
  it('should pass with a null numeric value', () => {
    const validator = new Validator({ age: null }, { age: 'nullable|numeric' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a empty array value', () => {
    const validator = new Validator({ items: [] }, { items: 'nullable|array' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a null boolean value', () => {
    const validator = new Validator({ accepted: null }, { accepted: 'nullable|boolean' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a null string value', () => {
    const validator = new Validator({ phone: null }, { user: 'nullable|string' })
    expect(validator.passes()).toBeTruthy()
  })
})
