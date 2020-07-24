import Validator from '../src'

describe('array rule', function() {
  it('should pass when array', function() {
    const validator = new Validator({
      input: { users: [] },
      rules: { users: 'array' },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail when given object', function() {
    const validator = new Validator({
      input: { users: {} },
      rules: { users: 'array' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail when given boolean', function() {
    const validator = new Validator({
      input: { users: false },
      rules: { users: 'array' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })
})
