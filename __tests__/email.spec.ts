import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('email validation rule', () => {
  it('should pass with the email address: johndoe@gmail.com', () => {
    const validator = new Validator({ email: 'johndoe@gmail.com' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the email address: johndoe.gmail.com', () => {
    const validator = new Validator({ email: 'johndoe.gmail.com' }, { email: 'email' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with the email address: johndoe@gmail', () => {
    const validator = new Validator({ email: 'johndoe@gmail' }, { email: 'email' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when the email address contains whitespace only and is required', () => {
    const validator = new Validator({ email: '   ' }, { email: 'required|email' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when the field is an empty string', () => {
    const validator = new Validator({ email: '' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', () => {
    const validator = new Validator({}, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass with the email addresses at domain 3-n levels', () => {
    const emails = [
      'john.doe@jänt.de', // containing umlauts
      'johndoe@gmail.com.uk', // containing country designation (uk)
      'johndoe@gmail.com.au', // containing country designation (au)
      'johndoe@gmail.com.kh', // containing country designation (kh)
    ]

    emails.forEach((email) => {
      const validator = new Validator({ email }, { email: 'email' })
      expect(validator.passes()).toBeTruthy()
    })
  })

  it('should pass when min:6 and max:30', () => {
    const validator = new Validator({ email: 'john.1@gmail.com' }, { email: 'email|min:6|max:30' })
    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should failed when email less then 6 chars', () => {
    const validator = new Validator({ email: 'john@gmail.com' }, { email: 'email|min:6|max:30' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should failed when email more then 10 chars', () => {
    const validator = new Validator({ email: 'johnxxxxxxxxxxxxxxxxxxxxxx@gmail.com' }, { email: 'email|min:6|max:10' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('validate the all valid emails', () => {
    const emails = [
      'john.doe@gmail.com',
      'john_doe@gmail.com',
      'john_.doe@gmail.com',
      'john._doe@gmail.com',
      '9john_doe@gmail.com',
      'john._.doe@gmail.com',
      '0john.doe@gmail.com',
      'john.__doe@gmail.com',
      'john.__.doe@gmail.com',
      'john_.doe@gmail.com',
      '_john.doe@gmail.com',
    ]

    emails.forEach((email) => {
      const validator = new Validator({ email }, { email: 'email' })
      expect(validator.passes()).toBeTruthy()
    })
  })

  it('validate the all invalid emails', () => {
    const emails = [
      '.john.doe@gmail.com',
      '.john_doe@gmail.com',
      'john..doe@gmail.com',
      'john.doe@gmail..com',
      'john.doe@gmail._com',
    ]
    emails.forEach((email) => {
      const validator = new Validator({ email }, { email: 'email' })
      expect(validator.fails()).toBeTruthy()
    })
  })
})
