import Validator from '../src'

describe('required unless', function() {
  it('should fail', function() {
    const validator = new Validator({
      input: {
        desert: 'icecream',
        flavour: '',
      },
      rules: {
        flavour: 'required_unless:desert,cake',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert is not cake.')
  })

  it('should pass', function() {
    const validator = new Validator({
      input: {
        desert: 'icecream',
        flavour: 'chocolate',
      },
      rules: {
        flavour: 'required_unless:desert,cake',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
