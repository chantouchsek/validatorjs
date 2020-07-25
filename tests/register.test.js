import Validator from '../src'

describe('register a custom validation rule', function() {
  let validator
  beforeEach(() => {
    validator = new Validator()
  })
  it('should be able to get validation rule', function() {
    validator.register('telephone', function(val) {
      return val.match(/^\d{3}-\d{3}-\d{4}$/)
    })
    expect(validator.getRule('telephone').validate).toBeInstanceOf(Function)
  })

  it('should pass the custom telephone rule registration', function() {
    validator.register('telephone', function(val) {
      return val.match(/^\d{3}-\d{3}-\d{4}$/)
    })

    validator.setOptions({
      input: {
        phone: '213-454-9988',
      },
      rules: {
        phone: 'telephone',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should override custom rules', function() {
    validator.register('string', function(val) {
      return true
    })

    validator.setOptions({
      input: {
        field: ['not a string'],
      },
      rules: {
        field: 'string',
      },
    })

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
    validator.register('string', function(val) {
      return typeof val === 'string'
    }, 'The :attribute must be a string.')
  })

  it('should throw error in case of unknown validator rule', function() {
    const validator = new Validator({
      input: {
        field: 'test',
      },
      rules: {
        field: 'unknown',
      },
    })

    expect(validator.passes).toThrow()
    expect(validator.fails).toThrow()
  })


  it('should allow to add custom validator to unknown validator rules', function() {
    validator.registerMissedRuleValidator(function() {
      return true
    })

    validator.setOptions({
      input: {
        field: 'test',
      },
      rules: {
        field: 'unknown',
      },
    })

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
