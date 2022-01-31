import Validator from '../src/main'

describe('register a custom validation rule', () => {
  it('should be able to get validation rule', () => {
    Validator.register('telephone', (val: string) => {
      return val.match(/^\d{3}-\d{3}-\d{4}$/)
    })

    const validator = new Validator()
    const validate = validator.getRule('telephone').validate
    expect(typeof validate).toBe('function')
  })

  it('should pass the custom telephone rule registration', () => {
    Validator.register('telephone', (val: string) => {
      return val.match(/^\d{3}-\d{3}-\d{4}$/)
    })

    const validator = new Validator(
      { phone: '213-454-9988' },
      { phone: 'telephone' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should override custom rules', () => {
    Validator.register('string', () => true)

    const validator = new Validator(
      { field: ['not a string'] },
      { field: 'string' },
    )

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
    Validator.register(
      'string',
      (val: string) => typeof val === 'string',
      'The :attribute must be a string.',
    )
  })

  it('should throw error in case of unknown validator rule', () => {
    const validator = new Validator({ field: 'test' }, { field: 'unknown' })

    try {
      validator.passes()
      expect(validator.fails).toThrow()
    } catch (e: any) {
      expect(e.message).toBe('Validator `unknown` is not defined!')
    }
  })

  it('should allow to add custom validator to unknown validator rules', () => {
    Validator.registerMissedRuleValidator(() => true)

    const validator = new Validator({ field: 'test' }, { field: 'unknown' })

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
