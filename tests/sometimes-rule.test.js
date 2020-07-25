import Validator from '../src'

describe('sometimes validation pass rules', function() {
  let validator
  beforeEach(() => {
    validator = new Validator()
  })
  it('should pass when the property is passed with data', function() {
    const validator = new Validator({
      input: {
        firstname: 'Johnny',
        lastname: 'Appleseed',
      },
      rules: {
        firstname: 'required',
        lastname: 'required|sometimes',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the property is not passed with data', function() {
    const validator = new Validator({
      input: {
        firstname: 'Johnny',
      },
      rules: {
        firstname: 'required',
        lastname: 'required|sometimes',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should be able to register and pass async rule when the property is passed with data', function(done) {
    validator.registerAsync('username', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')

    validator.setOptions({
      input: {
        username: 'test',
        email: 'test@example.com',
      },
      rules: {
        username: 'username',
        email: 'email|sometimes',
      },
    })
    validator.passes(done)
  })

  it('should be able to register and pass async rule when the property is not passed with data', function(done) {
    validator.registerAsync('username', function(desiredUsername, ruleValue, attribute, passes) {
      setTimeout(function() {
        if (desiredUsername === 'test') {
          passes()
        }
      }, 50)
    }, ':attribute is an invalid username')

    validator.setOptions({
      input: {
        username: 'test',
      },
      rules: {
        username: 'username',
        email: 'email|sometimes',
      },
    })
    validator.passes(done)
  })
})
