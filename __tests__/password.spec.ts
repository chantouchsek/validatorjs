import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('password rule', () => {
  it('should fail', () => {
    const validator = new Validator(
      {
        password: '12345678',
      },
      {
        password: 'password',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('password')).toEqual('The password attribute has errors.')
  })

  it('should pass', () => {
    const validator = new Validator(
      {
        password: 'Pa$$w0rd',
      },
      {
        flavour: 'password',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
