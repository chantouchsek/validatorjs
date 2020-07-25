import Validator from '../src'

describe('Validator custom messages', function() {
  it('override the default message for the validator', function() {
    const validator = new Validator({
      input: {
        name: '',
      },
      rules: {
        name: 'required',
      },
      customMessages: {
        required: 'Name is missing.',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('name').length).toEqual(1)
    expect(validator.errors.first('name')).toEqual('Name is missing.')
  })

  it('override the default message for a type of the validator', function() {
    const validator = new Validator({
      input: {
        name: 'A',
      },
      rules: {
        name: 'min:4',
      },
      customMessages: {
        min: {
          string: ':attribute is not long enough. Should be :min.',
        },
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('name').length).toEqual(1)
    expect(validator.errors.first('name')).toEqual('name is not long enough. Should be 4.')
  })

  it('override the default message for the validator with several :attribute in message', function() {
    const validator = new Validator({
      input: {
        name: '',
      },
      rules: {
        name: 'required',
      },
      customMessages: {
        required: ':attribute is required. :attribute can\'t be empty.',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('name').length).toEqual(1)
    expect(validator.errors.first('name')).toEqual('name is required. name can\'t be empty.')
  })

  it('override the default message for a type of the validator', function() {
    const validator = new Validator({
      input: {
        name: 'A',
      },
      rules: {
        name: 'min:4',
      },
      customMessages: {
        min: {
          string: ':attribute is not long enough. Should be :min.',
        },
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('name').length).toEqual(1)
    expect(validator.errors.first('name')).toEqual('name is not long enough. Should be 4.')
  })

  it('override the default message for a type of the validator with several :attribute and :min in message', function() {
    const validator = new Validator({
      input: {
        name: 'A',
      },
      rules: {
        name: 'min:4',
      },
      customMessages: {
        min: {
          string: ':attribute is not long enough. :attribute should be :min. Because needed string with :min symbols or more.',
        },
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('name').length).toEqual(1)
    expect(validator.errors.first('name')).toEqual('name is not long enough. name should be 4. Because needed string with 4 symbols or more.')
  })

  it('can be specified on a per attribute basis for a validator', function() {
    const validator = new Validator({
      input: {
        name: '',
        email: '',
      },
      rules: {
        name: 'required',
        email: 'required',
      },
      customMessages: {
        'required.name': 'Name is missing.',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('name').length).toEqual(1)
    expect(validator.errors.first('name')).toEqual('Name is missing.')
    expect(validator.errors.get('email').length).toEqual(1)
    expect(validator.errors.first('email')).toEqual('The email field is required.')
  })

  it('can be specified for custom validators', function() {
    const validator = new Validator()
    validator.register('telephone', function(value, requirement, attribute) {
      return value.match(/^\d{3}-\d{3}-\d{4}$/)
    }, 'The :attribute phone number is not in the format XXX-XXX-XXXX.')
    validator.setOptions({
      input: {
        phone: '1234567890',
      },
      rules: {
        phone: 'telephone',
      },
      messages: {
        telephone: 'Wrong number.',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('phone').length).toEqual(1)
    expect(validator.errors.first('phone')).toEqual('Wrong number.')
  })

  it('can be specified for custom validators per attribute', function() {
    const validator = new Validator()
    validator.register('telephone', function(value) {
      return value.match(/^\d{3}-\d{3}-\d{4}$/)
    }, 'The :attribute phone number is not in the format XXX-XXX-XXXX.')
    validator.setOptions({
      input: {
        phone: '1234567890',
        fax: '1234567890',
      },
      rules: {
        phone: 'telephone',
        fax: 'telephone',
      },
      messages: {
        'telephone.fax': 'Why are you even using a fax?',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.get('phone').length).toEqual(1)
    expect(validator.errors.first('phone')).toEqual('The phone phone number is not in the format XXX-XXX-XXXX.')
    expect(validator.errors.get('fax').length).toEqual(1)
    expect(validator.errors.first('fax')).toEqual('Why are you even using a fax?')
  })
})
