import Validator from '../src/main'

describe('attribute formatter tests', () => {
  it('should replace _[] with spaces by default', () => {
    const validator = new Validator({ 'all_users[3][first_name]': '' }, { 'all_users[3][first_name]': 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('all_users[3][first_name]')).toEqual('The all users 3 first name field is required.')
  })

  it('should be able configure global attribute formatter', () => {
    const originalAttributeFormatter = Validator.attributeFormatter
    Validator.setAttributeFormatter((attr: string) => attr.replace(/_/, ' '))
    const validator = new Validator({ first_name: '' }, { first_name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('first_name')).toEqual('The first name field is required.')
    Validator.setAttributeFormatter(originalAttributeFormatter)
  })

  it('should be able configure attribute formatter for particular instance', () => {
    const validator = new Validator({ first_name: '' }, { first_name: 'required' })
    validator.setAttributeFormatter((attribute: string) => attribute)
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('first_name')).toEqual('The first_name field is required.')
  })
})
