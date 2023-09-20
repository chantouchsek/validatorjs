import { beforeEach, describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('Validator constructor', () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator(
      { name: 'David', email: 'johndoe@gmail.com' },
      { name: 'required', email: 'required' },
      { customMessages: { required: 'You\'re missing :required' } },
    )
  })

  it('should expose on window if browser', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(window.Validator).toBeDefined()
    }
  })

  it('should have a rules property containing all the validation rules', () => {
    expect(typeof validator.rules).toBe('object')
  })

  it('should have an input property containing the input data to be validated', () => {
    expect(typeof validator.input).toBe('object')
  })

  it('should have a messages property containing the combined messages for validation', () => {
    expect(typeof validator.messages).toBe('object')
  })

  it('should have a passes() method', () => {
    expect(validator.passes).toBeDefined()
    expect(typeof validator.passes).toBe('function')
  })

  it('should have a fails() method', () => {
    expect(validator.fails).toBeDefined()
    expect(typeof validator.fails).toBe('function')
  })

  it('should have a check method', () => {
    expect(validator.check).toBeDefined()
    expect(typeof validator.check).toBe('function')
  })

  it('should handle undefined data', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should handle null data', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should get correct lang with exist', () => {
    const validator = new Validator(null, { name: 'required' }, { locale: 'km' })
    expect(validator.getDefaultLang()).toEqual('km')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('ឈ្មោះ ត្រូវតែបញ្ចូលជាដាច់ខាត។')
  })
})
