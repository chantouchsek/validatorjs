import Validator from '../src'

describe('alpha_dash validation rule', function() {
  it('should fail with non alpha dash characters', function() {
    const validator = new Validator({
      input: { name: 'David *' },
      rules: { name: 'alpha_dash' },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
  })
  it('should fail with non-alphabetic characters', function() {
    const validator = new Validator({
      input: { name: 12 },
      rules: { name: 'alpha_dash' },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with only alpha dash characters', function() {
    const validator = new Validator({
      input: { name: 'David9_-' },
      rules: { name: 'alpha_dash' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the field is blank / optional', function() {
    const validator = new Validator({
      input: { name: '' },
      rules: { name: 'alpha_dash' },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', function() {
    const validator = new Validator({
      input: {},
      rules: { name: 'alpha_dash' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
