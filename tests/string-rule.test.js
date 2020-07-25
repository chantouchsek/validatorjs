import Validator from '../src'

describe('string validation rule', function() {
  it('should pass when the input is a string', function() {
    const validator = new Validator({
      input: {
        name: 'David',
      },
      rules: {
        name: 'string',
      },
    })

    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when the input is not a string', function() {
    const validator = new Validator({
      input: {
        name: 5,
      },
      rules: {
        name: 'string',
      },
    })

    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('name')).toEqual('The name must be a string.')
  })
})
