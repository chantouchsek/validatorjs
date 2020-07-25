import Validator from '../src'

describe('required with', function() {
  it('should fail', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
        },
        flavour: '',
      },
      rules: {
        flavour: 'required_with:desert.first',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert.first is not empty.')
  })

  it('should pass', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
        },
        flavour: 'chocolate',
      },
      rules: {
        flavour: 'required_with:desert.first',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
