import Validator from '../src'

describe('required without', function() {
  it('should fail', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
        },
        flavour: '',
      },
      rules: {
        flavour: 'required_without:desert.second',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert.second is empty.')
  })

  it('should pass', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
          second: 'icecream',
        },
        flavour: '',
      },
      rules: {
        flavour: 'required_without:desert.second',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
