import Validator from '../src'

describe('Accepted validation rule', () => {
  it('should pass if the value is yes', () => {
    const validator = new Validator({
      input: { terms: 'yes' },
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(true)
    expect(validator.fails()).toBe(false)
  })
  it('should pass if the value is on', function() {
    const validator = new Validator({
      input: { terms: 'on' },
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(true)
    expect(validator.fails()).toBe(false)
  })
  it('should pass if the value is the number 1', function() {
    const validator = new Validator({
      input: { terms: '1' },
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(true)
    expect(validator.fails()).toBe(false)
  })
  it('should pass if the value is a boolean true', function() {
    const validator = new Validator({
      input: { terms: true },
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(true)
    expect(validator.fails()).toBe(false)
  })
  it('should fail if the value is not 1, on, or yes', function() {
    const validator = new Validator({
      input: { terms: '2' },
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(false)
    expect(validator.fails()).toBe(true)
  })
  it('should fail if the value is an empty string', function() {
    const validator = new Validator({
      input: { terms: null },
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(false)
    expect(validator.fails()).toBe(true)
  })
  it('should fail if the value undefined', function() {
    const validator = new Validator({
      input: {},
      rules: { terms: 'accepted' },
    })
    expect(validator.passes()).toBe(false)
    expect(validator.fails()).toBe(true)
  })
})
