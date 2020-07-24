import Validator from '../src'

describe('sometimes validation pass rules', function() {
  it('should pass when the property is passed with data', function() {
    const validator = new Validator({
      input: {
        firstName: 'Johnny',
        lastName: 'Appleseed',
      },
      rules: {
        firstName: 'required',
        lastName: 'required|sometimes',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should pass when the property is not passed with data', function() {
    const validator = new Validator({
      input: {
        firstName: 'Johnny',
      },
      rules: {
        firstName: 'required',
        lastName: 'required|sometimes',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
