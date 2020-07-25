import Validator from '../src'

describe('hex validation rule', function() {
  it('should fail with incorrect hexadecimal values', function() {
    const validator = new Validator({
      input: {
        color: '4d4b8z',
      },
      rules: {
        color: 'hex',
      },
    })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should pass for valid hexadecimal values ', function() {
    const validator = new Validator({
      input: {
        mongoId: '54759eb3c090d83494e2d804',
        symbolStr: '0',
        symbolNum: 0,
        str: 'a',
      },
      rules: {
        color: 'hex',
        mongoId: 'hex',
        symbolStr: 'hex',
        symbolNum: 'hex',
        str: 'hex',
      },
    })

    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an empty value', function() {
    const validator = new Validator({
      input: {
        color: '',
        mongoId: '',
      },
      rules: {
        color: 'hex',
        mongoId: 'hex',
      },
    })

    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an undefined value', function() {
    const validator = new Validator({
      input: {},
      rules: {
        color: 'hex',
        mongoId: 'hex',
      },
    })

    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
})
