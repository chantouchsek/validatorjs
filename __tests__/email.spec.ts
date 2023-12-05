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

  it('should pass with first.last@example.com', () => {
    const validator = new Validator({ email: 'first.last@example.com' }, { email: 'email' })

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass with the email addresses containing umlauts: john.doe@jänt.de', () => {
    const validator = new Validator({ email: 'john.doe@jänt.de' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the email addresses containing country designation (uk)', () => {
    const validator = new Validator({ email: 'johndoe@gmail.com.uk' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the email addresses containing country designation (au)', () => {
    const validator = new Validator({ email: 'johndoe@gmail.com.au' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the email addresses at domain 3-n level', () => {
    const validator = new Validator({ email: 'chantouchsek.cs83@gmail.com.km' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })
})
