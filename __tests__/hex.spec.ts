import Validator from '../src/main'

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
        symbolStr: '0',
        symbolNum: 0,
        str: 'a',
      },
      {
        color: 'hex',
        mongoId: 'hex',
        symbolStr: 'hex',
        symbolNum: 'hex',
        str: 'hex',
      },
    )

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an empty value', () => {
    const validator = new Validator(
      { olor: '', mongoId: '' },
      { color: 'hex', mongoId: 'hex' },
    )

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an undefined value', () => {
    const validator = new Validator({}, { color: 'hex', mongoId: 'hex' })

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })
})
