import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('required if', () => {
  it('should fail', () => {
    const validator = new Validator({ desert: 'ice-cream', flavour: '' }, { flavour: 'required_if:desert,ice-cream' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert is ice-cream.')
  })

  it('should pass', () => {
    const validator = new Validator(
      { desert: 'ice-cream', flavour: 'chocolate' },
      { flavour: 'required_if:desert,ice-cream' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass, both value is not the same', () => {
    const validator = new Validator(
      { desert: 'chocolate', flavour: 'ice-cream' },
      { flavour: 'required_if:desert,ice-cream' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
