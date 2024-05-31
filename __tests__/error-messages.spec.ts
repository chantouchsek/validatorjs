import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('error messages', () => {
  describe('first()', () => {
    it('should return an error message that states the email is required', () => {
      const validator = new Validator({ email: '' }, { email: 'required|email' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('email')).toEqual('The email field is required.')
    })

    it('should have a method on the errors object to retrieve the first error message for an attribute', () => {
      const validator = new Validator({ email: '' }, { email: 'required|email' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('email')).toEqual('The email field is required.')
    })

    it('should return false if errors.first() is called and there are no errors', () => {
      const validator = new Validator({ email: 'john@yahoo.com' }, { email: 'required|email' })
      expect(validator.passes()).toBeTruthy()
      expect(validator.errors.first('email')).toEqual(undefined)
    })

    it('should return an error message that states the email must be valid', () => {
      const validator = new Validator({ email: 'john@yahoo' }, { email: 'required|email' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('email')).toEqual('The email format is invalid.')
    })

    it('should return null for a key without an error message', () => {
      const validator = new Validator({ name: 'David' }, { name: 'required' })
      expect(validator.passes()).toBeTruthy()
      expect(validator.errors.first('name')).toBeFalsy()
    })

    it('should return error messages with attribute names and values for multi-part rules', () => {
      const validator = new Validator(
        {
          age: 17,
          description: 'a',
          hours: 3,
          info: '',
          pin: '123',
          range: 20,
          tweet: 'some tweet',
        },
        {
          age: 'min:18',
          description: 'required|min:5',
          hours: 'size:5',
          info: 'required|min:3',
          pin: 'size:4',
          range: 'max:10',
          tweet: 'max:5',
        },
      )

      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('age')).toEqual('The age must be at least 18.') // min numeric
      expect(validator.errors.first('description')).toEqual('The description must be at least 5 characters.') // min string
      expect(validator.errors.first('info')).toEqual('The info field is required.')
      expect(validator.errors.first('hours')).toEqual('The hours must be 5.') // size numeric
      expect(validator.errors.first('pin')).toEqual('The pin must be 4 characters.') // size string
      expect(validator.errors.first('range')).toEqual('The range may not be greater than 10.') // max numeric
      expect(validator.errors.first('tweet')).toEqual('The tweet may not be greater than 5 characters.') // max string
    })

    it('should return a customized alpha error message', () => {
      const validator = new Validator(
        {
          name: '12',
        },
        {
          name: 'alpha',
        },
      )
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('name')).toEqual('The name field must contain only alphabetic characters.')
    })

    it('should fail with non alpha dash characters', () => {
      const validator = new Validator({ name: 'David *' }, { name: 'alpha_dash' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('name')).toEqual(
        'The name field may only contain alpha-numeric characters, as well as dashes and underscores.',
      )
    })

    it('should fail without a matching confirmation field for the field under validation', () => {
      const validator = new Validator({ password: 'abc' }, { password: 'confirmed' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('password')).toEqual('The password does not match.')
    })

    it('should fail when the 2 attributes are the same', () => {
      const validator = new Validator({ field1: 'abc', field2: 'abc' }, { field2: 'different:field1' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('field2')).toEqual('The field2 and field1 must be different.')
    })

    it('should fail with a url only containing http://', () => {
      const link = 'http://'
      const validator = new Validator({ link }, { link: 'url' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('link')).toEqual('The link format is invalid.')
    })

    it('should fail the custom telephone rule registration with a default error message', () => {
      Validator.register('telephone', (val: string) => {
        return val.match(/^\d{3}-\d{3}-\d{4}$/)
      })

      const validator = new Validator({ phone: '4213-454-9988' }, { phone: 'telephone' })
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('phone')).toEqual('The phone attribute has errors.')
    })

    it('should fail the custom telephone rule registration with a custom error message', () => {
      Validator.register(
        'telephone',
        (val: string) => {
          return val.match(/^\d{3}-\d{3}-\d{4}$/)
        },
        'The :attribute phone number is not in the format XXX-XXX-XXXX.',
      )

      const validator = new Validator(
        {
          cell: '4213-454-9988',
        },
        {
          cell: 'telephone',
        },
      )
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.first('cell')).toEqual('The cell phone number is not in the format XXX-XXX-XXXX.')
    })
  })

  describe('get()', () => {
    it('should return an array of all email error messages', () => {
      const validator = new Validator({ email: '' }, { email: 'required|email' })

      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.get('email')).toBeInstanceOf(Array)
      expect(validator.errors.get('email').length).toEqual(1)
    })

    it('should return an empty array if there are no messages for an attribute', () => {
      const validator = new Validator(
        {
          email: 'johndoe@gmail.com',
        },
        {
          email: 'required|email',
        },
      )

      expect(validator.passes()).toBeTruthy()
      expect(validator.errors.get('email')).toBeInstanceOf(Array)
      expect(validator.errors.get('email').length).toEqual(0)
    })

    it('should return multiple array items for an attribute', () => {
      const validator = new Validator({ email: 'x' }, { email: 'email|min:10' })

      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.get('email')).toBeInstanceOf(Array)
      expect(validator.errors.get('email').length).toEqual(2)
    })
  })

  describe('validatorErrors.prototype.all()', () => {
    it('should return an array of all email error messages', () => {
      const validation = new Validator(
        { age: 28, email: '', name: 'd' },
        { age: 'min:18', email: 'required|email', name: 'required|min:2' },
      )

      const expected = JSON.stringify({
        email: ['The email field is required.'],
        name: ['The name must be at least 2 characters.'],
      })

      expect(validation.passes()).toBeFalsy()
      expect(JSON.stringify(validation.errors.all())).toEqual(expected)
    })
  })

  describe('validatorErrors.prototype.has()', () => {
    it('should return an array of all email error messages', () => {
      const validation = new Validator(
        { age: 28, email: '', name: 'd' },
        { age: 'min:18', email: 'required|email', name: 'required|min:2' },
      )

      expect(validation.passes()).toBeFalsy()
      expect(validation.errors.has('name')).toEqual(true)
      expect(validation.errors.has('age')).toEqual(false)
      expect(validation.errors.has('fake-property')).toEqual(false)
    })
  })

  describe('should output correct error messages for numeric-like rules', () => {
    it('should give correct error message with numeric rule', () => {
      const validator = new Validator({ val: '1' }, { val: 'numeric|min:2' })
      expect(validator.fails()).toBeTruthy()
      expect(validator.errors.first('val')).toEqual('The val must be at least 2.')
    })

    it('should give correct error message with integer rule', () => {
      const validator = new Validator({ val: '1' }, { val: 'integer|min:2' })
      expect(validator.fails()).toBeTruthy()
      expect(validator.errors.first('val')).toEqual('The val must be at least 2.')
    })
  })
})
