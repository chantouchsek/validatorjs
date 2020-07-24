import Validator from '../src'

describe('between rule', function() {
  it('should pass between rule when 25 and between 18 - 30', function() {
    const validator = new Validator({
      input: { num: 25 },
      rules: { num: 'between:18,30' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass between rule when 25 and between 25 - 30', function() {
    const validator = new Validator({
      input: { num: 25 },
      rules: { num: 'between:25,30' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail on string 25 when between is set to 25 - 30', function() {
    const validator = new Validator({
      input: { num: '25' },
      rules: { num: 'between:18,30' },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass on string 25 when between is set to 2 - 3', function() {
    const validator = new Validator({
      input: { num: '25' },
      rules: { num: 'between:2,3' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should threat string 25 as numeric when other numeric rules are set and pass when between is set to 25 - 30', function() {
    const validator = new Validator({
      input: { num: '25' },
      rules: { num: 'between:25,30|numeric' },
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
        num1: 'between:25.11,25.13',
        num2: 'between:0.02,0.04',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should support unsigned', function() {
    const validator = new Validator({
      input: { num: -3 },
      rules: { num: 'between:-4,-2' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should support array', function() {
    const validator = new Validator({
      input: { array2: ['a', 'b'] },
      rules: { array2: 'required|between:1,2' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should generate proper error message', function() {
    const validator = new Validator({
      input: { num: '14' },
      rules: { num: 'between:16,23' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('num')).toEqual('The num field must be between 16 and 23.')
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
        numNull: 'between:25,30',
        numUndefined: 'between:25,30',
        numEmpty: 'between:25,30',
        numOutOfBounds: 'between:25,30',
        numOutOfBoundsUnsigned: 'between:-35,150',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })
})
