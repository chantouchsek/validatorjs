import Validator from '../src'

describe('attribute formatter tests', function() {
  it('should replace _[] with spaces by default', function() {
    const validator = new Validator({
      input: {
        'all_users[3][first_name]': '',
      },
      rules: {
        'all_users[3][first_name]': 'required',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('all_users[3][first_name]')).toEqual('The all users 3 first name field is required.')
  })

  it('should be able configure global attribute formatter', function() {
    const originalAttributeFormatter = Validator.prototype.attributeFormatter
    const validator = new Validator()
    validator.setAttributeFormatter(function(attribute) {
      return attribute.replace(/_/, ' ')
    })
    validator.setOptions({
      input: { first_name: '' },
      rules: { first_name: 'required' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('first_name')).toEqual('The first name field is required.')
    validator.setAttributeFormatter(originalAttributeFormatter)
  })

  it('should be able configure attribute formatter for particular instance', function() {
    const validator = new Validator({
      input: {
        first_name: '',
      },
      rules: {
        first_name: 'required',
      },
    })
    validator.setAttributeFormatter(function(attribute) {
      return attribute
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('first_name')).toEqual('The first_name field is required.')
  })
})
