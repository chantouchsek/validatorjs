import Validator from '../src'

describe('required with all', function() {
  it('should fail', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
          second: 'icecream',
        },
        flavour: '',
      },
      rules: {
        flavour: 'required_with_all:desert.first,desert.second',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert.first, desert.second are' +
      ' not empty.')
  })

  it('should pass', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
          second: 'icecream',
        },
        flavour: 'chocolate',
      },
      rules: {
        flavour: 'required_with_all:desert.first,desert.second',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass (not all required field are set)', function() {
    const validator = new Validator({
      input: {
        desert: {
          first: 'icecream',
        },
        flavour: '',
      },
      rules: {
        flavour: 'required_with_all:desert.first,desert.second',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
