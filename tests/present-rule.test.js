import Validator from '../src'

describe('present validation rule', function() {
  it('should pass with attribute present', function() {
    const validator = new Validator({
      input: {
        email: 'name@domain.com',
      },
      rules: {
        email: 'present',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with attribute not present', function() {
    const validator = new Validator({
      input: {},
      rules: {
        email: 'present',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

})
