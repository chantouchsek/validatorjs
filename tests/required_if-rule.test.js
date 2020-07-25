import Validator from '../src'

describe('required if', function() {
  it('should fail', function() {
    const validator = new Validator({
      input: {
        desert: 'icecream',
        flavour: '',
      },
      rules: {
        flavour: 'required_if:desert,icecream',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert is icecream.')
  })

  it('should pass', function() {
    const validator = new Validator({
      input: {
        desert: 'icecream',
        flavour: 'chocolate',
      },
      rules: {
        flavour: 'required_if:desert,icecream',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
