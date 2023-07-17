import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('present validation rule', () => {
  it('should pass with attribute present', () => {
    const validator = new Validator({ email: 'name@domain.com' }, { email: 'present' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with attribute not present', () => {
    const validator = new Validator({}, { email: 'present' })
    expect(validator.passes()).toBeFalsy()
  })
})
