import Validator from '../src'

describe('Error messages', function() {
  describe('first()', function() {
    it('should return an error message that states the email is required', function() {
      const validator = new Validator({
        input: {
          email: '',
        },
        rules: {
          email: 'required|email',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('email')).toEqual('The email field is required.')
    })

    it('should have a method on the errors object to retrieve the first error message for an attribute', function() {
      const validator = new Validator({
        input: {
          email: '',
        },
        rules: {
          email: 'required|email',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('email')).toEqual('The email field is required.')
    })

    it('should return false if errors.first() is called and there are no errors', function() {
      const validator = new Validator({
        input: {
          email: 'john@yahoo.com',
        },
        rules: {
          email: 'required|email',
        },
      })
      expect(validator.passes()).toBeTruthy()
      expect(validator.errors.first('email')).toEqual(undefined)
    })

    it('should return an error message that states the email must be valid', function() {
      const validator = new Validator({
        input: {
          email: 'john@yahoo',
        },
        rules: {
          email: 'required|email',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('email')).toEqual('The email format is invalid.')
    })

    it('should return null for a key without an error message', function() {
      const validator = new Validator({
        input: {
          name: 'David',
        },
        rules: {
          name: 'required',
        },
      })
      expect(validator.passes()).toBeTruthy()
      expect(validator.errors.first('name')).not.toBeTruthy()
    })

    it('should return error messages with attribute names and values for multi-part rules', function() {
      const validator = new Validator({
        input: {
          age: 17,
          description: 'a',
          info: '',
          hours: 3,
          pin: '123',
          range: 20,
          tweet: 'some tweet',
          gt: 1,
          lt: 2
        },
        rules: {
          age: 'min:18',
          description: 'required|min:5',
          info: 'required|min:3',
          hours: 'size:5',
          pin: 'size:4',
          range: 'max:10',
          tweet: 'max:5',
          gt: 'gt:lt',
          lt: 'lt:gt'
        },
      })

      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('age')).toEqual('The age must be at least 18.') // min numeric
      expect(validator.errors.first('description')).toEqual('The description must be at least 5 characters.') // min string
      expect(validator.errors.first('info')).toEqual('The info field is required.')
      expect(validator.errors.first('hours')).toEqual('The hours must be 5.') // size numeric
      expect(validator.errors.first('pin')).toEqual('The pin must be 4 characters.') // size string
      expect(validator.errors.first('range')).toEqual('The range may not be greater than 10.') // max numeric
      expect(validator.errors.first('tweet')).toEqual('The tweet may not be greater than 5 characters.') // max string
      expect(validator.errors.first('gt')).toEqual('The gt must be greater than lt.') // gt numeric
      expect(validator.errors.first('lt')).toEqual('The lt must be less than gt.') // lt numeric
    })

    it('should return a customized alpha error message', function() {
      const validator = new Validator({
        input: {
          name: '12',
        },
        rules: {
          name: 'alpha',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('name')).toEqual('The name field must contain only alphabetic characters.')
    })

    it('should fail with non alpha dash characters', function() {
      const validator = new Validator({
        input: {
          name: 'David *',
        },
        rules: {
          name: 'alpha_dash',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('name')).toEqual('The name field may only contain alpha-numeric characters, as well as dashes and underscores.')
    })

    it('should fail without a matching confirmation field for the field under validation', function() {
      const validator = new Validator({
        input: {
          password: 'abc',
        },
        rules: {
          password: 'confirmed',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('password')).toEqual('The password does not match.')
    })

    it('should fail when the 2 attributes are the same', function() {
      const validator = new Validator({
        input: {
          field1: 'abc',
          field2: 'abc',
        },
        rules: {
          field2: 'different:field1',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('field2')).toEqual('The field2 and field1 must be different.')
    })

    it('should fail with a url only containing http://', function() {
      const link = 'http://'
      const validator = new Validator({
        input: {
          link: link,
        },
        rules: {
          link: 'url',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('link')).toEqual('The link format is invalid.')
    })

    it('should fail the custom telephone rule registration with a default error message', function() {
      const validator = new Validator()
      validator.register('telephone', function(val) {
        return val.match(/^\d{3}-\d{3}-\d{4}$/)
      })
      validator.setOptions({
        input: {
          phone: '4213-454-9988',
        },
        rules: {
          phone: 'telephone',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('phone')).toEqual('The phone attribute has errors.')
    })

    it('should fail the custom telephone rule registration with a custom error message', function() {
      const validator = new Validator()
      validator.register('telephone', function(val) {
        return val.match(/^\d{3}-\d{3}-\d{4}$/)
      }, 'The :attribute phone number is not in the format XXX-XXX-XXXX.')

      validator.setOptions({
        input: {
          cell: '4213-454-9988',
        },
        rules: {
          cell: 'telephone',
        },
      })
      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.first('cell')).toEqual('The cell phone number is not in the format XXX-XXX-XXXX.')
    })
  })

  describe('get()', function() {
    it('should return an array of all email error messages', function() {
      const validator = new Validator({
        input: {
          email: '',
        },
        rules: {
          email: 'required|email',
        },
      })

      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.get('email')).toBeInstanceOf(Array)
      expect(validator.errors.get('email').length).toEqual(1)
    })

    it('should return an empty array if there are no messages for an attribute', function() {
      const validator = new Validator({
        input: {
          email: 'johndoe@gmail.com',
        },
        rules: {
          email: 'required|email',
        },
      })

      expect(validator.passes()).toBeTruthy()
      expect(validator.errors.get('email')).toBeInstanceOf(Array)
      expect(validator.errors.get('email').length).toEqual(0)
    })

    it('should return multiple array items for an attribute', function() {
      const validator = new Validator({
        input: {
          email: 'x',
        },
        rules: {
          email: 'email|min:10',
        },
      })

      expect(validator.passes()).not.toBeTruthy()
      expect(validator.errors.get('email')).toBeInstanceOf(Array)
      expect(validator.errors.get('email').length).toEqual(2)
    })
  })

  describe('ValidatorErrors.prototype.all()', function() {
    it('should return an array of all email error messages', function() {
      const validation = new Validator({
        input: {
          name: 'd',
          email: '',
          age: 28,
        },
        rules: {
          name: 'required|min:2',
          email: 'required|email',
          age: 'min:18',
        },
      })

      const expected = JSON.stringify({
        name: ['The name must be at least 2 characters.'],
        email: ['The email field is required.'],
      })

      expect(validation.passes()).not.toBeTruthy()
      expect(JSON.stringify(validation.errors.all())).toEqual(expected)
    })
  })

  describe('ValidatorErrors.prototype.has()', function() {
    it('should return an array of all email error messages', function() {
      const validation = new Validator({
        input: {
          name: 'd',
          email: '',
          age: 28,
        },
        rules: {
          name: 'required|min:2',
          email: 'required|email',
          age: 'min:18',
        },
      })

      expect(validation.passes()).not.toBeTruthy()
      expect(validation.errors.has('name')).toEqual(true)
      expect(validation.errors.has('age')).toEqual(false)
      expect(validation.errors.has('fake-property')).toEqual(false)
    })
  })

  describe('should output correct error messages for numeric-like rules', function() {
    it('should give correct error message with numeric rule', function() {
      const validator = new Validator({
        input: {
          val: '1',
        },
        rules: {
          val: 'numeric|min:2',
        },
      })
      expect(validator.fails()).toBeTruthy()
      expect(validator.errors.first('val')).toEqual('The val must be at least 2.')
    })

    it('should give correct error message with integer rule', function() {
      const validator = new Validator({
        input: {
          val: '1',
        },
        rules: {
          val: 'integer|min:2',
        },
      })
      expect(validator.fails()).toBeTruthy()
      expect(validator.errors.first('val')).toEqual('The val must be at least 2.')
    })
  })
})
