import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('hex validation rule', () => {
  it('should fail with incorrect hexadecimal values', () => {
    const validator = new Validator({ color: '4d4b8z' }, { color: 'hex' })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should pass for valid hexadecimal values ', () => {
    const validator = new Validator(
      {
        mongoId: '54759eb3c090d83494e2d804',
        str: 'a',
        symbolNum: 0,
        symbolStr: '0',
      },
      {
        color: 'hex',
        mongoId: 'hex',
        str: 'hex',
        symbolNum: 'hex',
        symbolStr: 'hex',
      },
    )

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an empty value', () => {
    const validator = new Validator({ mongoId: '', olor: '' }, { color: 'hex', mongoId: 'hex' })

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an undefined value', () => {
    const validator = new Validator({}, { color: 'hex', mongoId: 'hex' })

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })
})
