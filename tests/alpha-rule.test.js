import Validator from '../src'

describe('alpha validation rule', () => {
  it('should fail with non-alphabetic characters', function() {
    const validator = new Validator({
      input: { name: 1 },
      rules: { name: 'alpha' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBe(false)
    expect(validator.errors.first('name')).toEqual('The name field must contain only alphabetic characters.')
  })
  it('should pass with only alphabetic characters', function() {
    const validator = new Validator({
      input: { name: 'abc' },
      rules: { name: 'alpha' },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
  it('should pass when the field is an empty string', function() {
    const validator = new Validator({
      input: { name: null },
      rules: { name: 'alpha' },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
  it('should pass when the field does not exist', function() {
    const validator = new Validator({
      input: {},
      rules: { name: 'alpha' },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
})
