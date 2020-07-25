import Validator from '../src'

describe('digits between rule', function() {
  it('should pass between rule when 25 and between 18 - 30', function() {
    const validator = new Validator({
      input: { num: 25 },
      rules: { num: 'digits_between:18,30' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass between rule when 25 and between 25 - 30', function() {
    const validator = new Validator({
      input: { num: 25 },
      rules: { num: 'digits_between:25,30' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail on string 24 when between is set to 25 - 30', function() {
    const validator = new Validator({
      input: { num: '24' },
      rules: { num: 'digits_between:25,30' },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass on string 2 when between is set to 2 - 3', function() {
    const validator = new Validator({
      input: { num: '2' },
      rules: { num: 'digits_between:2,3' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should threat string 25 as numeric when other numeric rules are set and pass when between is set to 25 - 30', function() {
    const validator = new Validator({
      input: { num: '25' },
      rules: { num: 'digits_between:25,30|numeric' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should support floats', function() {
    const validator = new Validator({
      input: {
        num1: 25.12,
        num2: 0.03,
      },
      rules: {
        num1: 'digits_between:25.11,25.13',
        num2: 'digits_between:0.02,0.04',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should support unsigned', function() {
    const validator = new Validator({
      input: { num: -3 },
      rules: { num: 'digits_between:-4,-2' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should generate proper error message', function() {
    const validator = new Validator({
      input: { num: '14' },
      rules: { num: 'digits_between:16,23' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('num')).toEqual('The num field must be between 16 and 23 digits.')
  })

  it('should fail when passed invalid values', function() {
    const validator = new Validator({
      input: {
        numNull: null,
        numUndefined: undefined,
        numEmpty: '',
        numOutOfBounds: 24,
        numOutOfBoundsUnsigned: -34,
      },
      rules: {
        numNull: 'digits_between:25,30',
        numUndefined: 'digits_between:25,30',
        numEmpty: 'digits_between:25,30',
        numOutOfBounds: 'digits_between:25,30',
        numOutOfBoundsUnsigned: 'digits_between:-35,150',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })
})
