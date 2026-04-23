import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Validator } from '../src/main'

describe('validator constructor', () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator(
      { email: 'johndoe@gmail.com', name: 'David' },
      { email: 'required', name: 'required' },
      { customMessages: { required: 'You\'re missing :required' } },
    )
  })

  it('should expose on window if browser', () => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line ts/ban-ts-comment
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

  it('should handle empty rule', () => {
    const validator = new Validator(null, { name: '' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should handle undefined rule', () => {
    const validator = new Validator(null, { age: undefined })
    expect(validator.passes()).toBeTruthy()
  })

  it('should handle null rule', () => {
    const validator = new Validator(null, { gender: null })
    expect(validator.passes()).toBeTruthy()
  })

  it('should get correct lang with exist', () => {
    const validator = new Validator(null, { name: 'required' }, { locale: 'km' })
    expect(validator.getDefaultLang()).toEqual('km')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('ឈ្មោះ ត្រូវតែបញ្ចូលជាដាច់ខាត។')
  })

  it('should get the default attribute name from config -> ja', () => {
    const validator = new Validator({}, { name: 'required|string' }, { defaultAttributeName: { en: 'This field', ja: 'この項目' }, locale: 'ja' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('この項目は必須です。')
  })

  it('should get the default attribute name from  -> en', () => {
    const validator = new Validator({}, { name: 'required|string' }, { defaultAttributeName: { en: '', ja: 'この項目' }, locale: 'en' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('The field is required.')
  })
  it('confirmedReverse rebinds failure attribute to *_confirmation', () => {
    const validator = new Validator(
      { password: 'secret', password_confirmation: 'different' },
      { password: 'confirmed' },
      { confirmedReverse: true },
    )

    expect(validator.check()).toBe(false)

    expect(validator.errors.has('password_confirmation')).toBe(true)
    expect(validator.errors.has('password')).toBe(false)
  })
  it('checkAsync skips validateRule when _isValidatable is false', () => {
    const fn = vi.fn((_value: unknown, _req: unknown, _attr: string, passes: () => void) => passes())
    Validator.registerAsync('async_nonimplicit_for_coverage', fn, 'invalid')

    const v = new Validator(
      {}, // missing "email" => undefined
      { email: 'async_nonimplicit_for_coverage' },
    )

    // force async path
    expect(v.hasAsync).toBe(true)

    const passes = vi.fn()
    const fails = vi.fn()

    v.checkAsync(passes, fails)

    // Branch covered: condition false => validateRule() NOT called
    expect(fn).not.toHaveBeenCalled()

    // Since nothing failed, resolver flow should end as pass
    expect(passes).toHaveBeenCalled()
    expect(fails).not.toHaveBeenCalled()
  })
})
