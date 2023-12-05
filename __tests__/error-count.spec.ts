import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('error counts', () => {
  it('should return 0 when validation has not yet run', () => {
    const validator = new Validator({ username: '' }, { username: 'required' })
    expect(validator.errorCount).toEqual(0)
  })

  it('should return a count when there are errors', () => {
    const validator = new Validator({ name: '', username: '' }, { name: 'required', username: 'required' })
    expect(validator.passes()).toBeFalsy()
    expect(validator.errorCount).toEqual(2)
  })

  it('should not return a count when error free', () => {
    const validator = new Validator({ name: 'a', username: 'a' }, { name: 'required', username: 'required' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.errorCount).toEqual(0)
  })
})
