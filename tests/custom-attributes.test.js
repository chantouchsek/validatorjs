import Validator from '../src'

describe('Use custom attribute', () => {
  it('should be able set custom attributes', function() {
    const validator = new Validator({
      input: {
        form: {
          name: null
        }
      },
      rules: {
        form: {
          name: 'required',
          age: 'required'
        }
      },
      customAttributes: {
        form: {
          name: 'Username'
        }
      },
      customMessages: {
        required: 'The :attribute need to be filled.'
      }
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('form.name')).toEqual('The Username need to be filled.')
  })
})
