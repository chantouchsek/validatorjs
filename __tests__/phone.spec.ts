import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Validator } from '../src/main'
import { registerPhoneRule } from '../src/phone'

const international = '+855 12 345 678'
const national = '012 345 678'
const originalEn = { ...Validator.getMessages('en') }
const originalFr = { ...Validator.getMessages('fr') }

it('does not register the optional rule merely by importing the adapter', () => {
  expect(new Validator({}).getRule('phone').isMissed()).toBe(true)
  expect(() => new Validator({ contact: international }, { contact: 'phone' }).passes())
    .toThrow('Validator `phone` is not defined!')
})

describe('explicitly registered phone validation', () => {
  beforeEach(() => {
    Validator.useLang('en')
    registerPhoneRule(Validator)
  })

  afterEach(() => {
    Validator.setMessages('en', { ...originalEn })
    Validator.setMessages('fr', { ...originalFr })
    Validator.useLang('en')
  })

  it.each([
    ['phone', international],
    ['phone', '  +1 (213) 373-4253  '],
    ['phone', '+33 1 45 45 32 45'],
    ['phone', '+800 1234 5678'],
    ['phone:KH', international],
    ['phone:KH', national],
    ['phone:US', '+1 213 373 4253'],
    ['phone:US', '(213) 373-4253'],
    ['phone:CA', '+1 416 555 0123'],
    ['phone:FR', '01 45 45 32 45'],
    ['phone:FR', '00 33 1 45 45 32 45'],
    ['phone:GB', '+44 20 7946 0018'],
    ['phone:GB', '020 7946 0018'],
    ['phone:XK', '+383 44 123 456'],
  ])('accepts %s with %s', (rule, value) => {
    const validator = new Validator({ contact: value }, { contact: rule })
    expect(validator.passes()).toBe(true)
    expect(validator.errors.all()).toEqual({})
  })

  it.each([
    ['phone', national],
    ['phone', '2133734253'],
    ['phone', '00 33 1 45 45 32 45'],
    ['phone', '+999123456789'],
    ['phone', '+1 111 111 1111'],
    ['phone', '+1213'],
    ['phone', 'Call +1 213 373 4253'],
    ['phone', '+1 213 373 4253 is my number'],
    ['phone', '+1 213 373 4253 ext. 123'],
    ['phone', '+1 213 373 4253 x123'],
    ['phone:US', '(213) 373-4253 ext. 123'],
    ['phone', 'tel:+12133734253'],
    ['phone:US', 'tel:+12133734253'],
    ['phone:US', 'TEL:+12133734253;ext=123'],
    ['phone:KH', '+1 213 373 4253'],
    ['phone:US', '+1 416 555 0123'],
    ['phone:CA', '+1 213 373 4253'],
    ['phone:US', '+800 1234 5678'],
    ['phone:KH', 'invalid'],
    ['phone:KH', '011 1 213 373 4253'],
  ])('rejects %s with %s', (rule, value) => {
    const validator = new Validator({ contact: value }, { contact: rule })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.get('contact')).toHaveLength(1)
  })

  it.each(['', 'kh', 'ZZ', 'UK', 'KH,US', 'KH:US', ' KH', '__proto__', '001'])('rejects malformed country parameter %j', (parameter) => {
    const validator = new Validator({ contact: international }, { contact: `phone:${parameter}` })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.has('contact')).toBe(true)
  })

  it.each([null, 0, true, ['KH'], { country: 'KH' }])('rejects non-string object-rule country %j', (parameter) => {
    const validator = new Validator({ contact: international }, { contact: [{ phone: parameter }] })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.has('contact')).toBe(true)
  })

  it('accepts object-rule countries and treats an undefined parameter as a bare rule', () => {
    expect(new Validator({ contact: national }, { contact: [{ phone: 'KH' }] }).passes()).toBe(true)
    expect(new Validator({ contact: international }, { contact: [{ phone: undefined }] }).passes()).toBe(true)
    expect(new Validator({ contact: national }, { contact: [{ phone: undefined }] }).fails()).toBe(true)
  })

  it.each([0, 85512345678, false, true, [], [international], {}, Reflect.construct(String, [international])])('rejects supplied non-string input %j', (value) => {
    const validator = new Validator({ contact: value }, { contact: 'phone' })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.has('contact')).toBe(true)
  })

  it.each([undefined, null, '', ' \t\n '])('preserves optional/required semantics for %j', (value) => {
    expect(new Validator({ contact: value }, { contact: 'phone' }).passes()).toBe(true)
    expect(new Validator({ contact: value }, { contact: 'phone:invalid' }).passes()).toBe(true)
    const required = new Validator({ contact: value }, { contact: 'required|phone' })
    expect(required.fails()).toBe(true)
    expect(required.errors.get('contact')).toEqual(['The contact field is required.'])
  })

  it('preserves missing, sometimes, present, nullable, and conditional required behavior', () => {
    expect(new Validator({}, { contact: 'phone' }).passes()).toBe(true)
    expect(new Validator({}, { contact: 'required|phone' }).fails()).toBe(true)
    expect(new Validator({}, { contact: 'sometimes|required|phone' }).passes()).toBe(true)
    expect(new Validator({ contact: '' }, { contact: 'sometimes|required|phone' }).fails()).toBe(true)
    expect(new Validator({}, { contact: 'present|phone' }).fails()).toBe(true)
    expect(new Validator({ contact: null }, { contact: 'present|phone' }).passes()).toBe(true)
    expect(new Validator({ contact: null }, { contact: 'nullable|phone' }).passes()).toBe(true)
    expect(new Validator({ notify: 'yes' }, { contact: 'required_if:notify,yes|phone' }).fails()).toBe(true)
    expect(new Validator({ notify: 'no' }, { contact: 'required_if:notify,yes|phone' }).passes()).toBe(true)
  })

  it('integrates nested/wildcard errors, custom messages, and attribute names without mutating input or rules', () => {
    const input = { contacts: [{ number: 'bad' }, { number: international }] }
    const rules = { 'contacts.*.number': 'required|phone:KH' }
    const messages = { 'phone.contacts.*.number': 'Enter a valid phone number for :attribute.' }
    const snapshot = JSON.stringify({ input, rules, messages })
    const validator = new Validator(input, rules, {
      customMessages: messages,
      customAttributes: { 'contacts.*.number': 'contact number' },
    })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.all()).toEqual({ 'contacts.0.number': ['Enter a valid phone number for contact number.'] })
    expect(JSON.stringify({ input, rules, messages })).toBe(snapshot)
  })

  it('preserves formatted strings and nested/wildcard projection in validated()', () => {
    const input = { user: { contact: `  ${international}  `, ignored: true }, contacts: [{ number: national }], ignored: true }
    const rules = { 'user.contact': 'phone', 'contacts.*.number': 'phone:KH' }
    const snapshot = JSON.stringify(input)
    const validator = new Validator(input, rules)
    expect(validator.validated()).toEqual({ user: { contact: `  ${international}  ` }, contacts: [{ number: national }] })
    expect(JSON.stringify(input)).toBe(snapshot)
  })

  it('uses localized generic fallback, existing phone translations, and normal custom-message precedence', () => {
    const fallback = new Validator({ contact: 'invalid' }, { contact: 'phone' }, { locale: 'fr' })
    expect(fallback.fails()).toBe(true)
    expect(fallback.errors.first('contact')).toBe('Le champ contact contient un attribut erroné.')
    Validator.setMessages('fr', { ...originalFr, phone: 'Le numéro :attribute est invalide.' })
    registerPhoneRule(Validator)
    expect(Validator.getDefaultLang()).toBe('fr')
    const translated = new Validator({ contact: 'invalid' }, { contact: 'phone' }, { locale: 'fr' })
    expect(translated.fails()).toBe(true)
    expect(translated.errors.first('contact')).toBe('Le numéro contact est invalide.')
    const custom = new Validator({ contact: 'invalid', other: 'invalid' }, { contact: 'phone', other: 'phone' }, {
      locale: 'fr',
      customMessages: { 'phone': 'Generic phone error.', 'phone.contact': 'Invalid :attribute.' },
      customAttributes: { contact: 'mobile' },
    })
    expect(custom.fails()).toBe(true)
    expect(custom.errors.first('contact')).toBe('Invalid mobile.')
    expect(custom.errors.first('other')).toBe('Generic phone error.')
  })

  it('can register under an untranslated non-English locale and be registered repeatedly', () => {
    Validator.useLang('fr')
    registerPhoneRule(Validator)
    registerPhoneRule(Validator)
    expect(Validator.getDefaultLang()).toBe('fr')
    const validator = new Validator({ contact: 'invalid' }, { contact: 'phone' })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.get('contact')).toEqual(['Le champ contact contient un attribut erroné.'])
  })

  it('runs alongside asynchronous business rules without sharing results between instances', async () => {
    Validator.registerAsync('phone_business_check', (_value: unknown, _requirement: unknown, _attribute: string, done: () => void) => {
      setTimeout(done, 0)
    })
    const valid = new Validator({ contact: national }, { contact: 'phone:KH|phone_business_check' })
    const invalid = new Validator({ contact: national }, { contact: 'phone|phone_business_check' })
    expect(await Promise.all([valid.passesAsync(), invalid.passesAsync()])).toEqual([true, false])
    expect(valid.errors.all()).toEqual({})
    expect(invalid.errors.get('contact')).toEqual(['The contact attribute has errors.'])
  })

  it('preserves state isolation and repeated sync/Promise/callback validation', async () => {
    registerPhoneRule(Validator)
    const valid = new Validator({ contact: national }, { contact: 'phone:KH' })
    const invalid = new Validator({ contact: national }, { contact: 'phone' })
    expect(valid.passes()).toBe(true)
    expect(invalid.fails()).toBe(true)
    expect(invalid.fails()).toBe(true)
    expect(invalid.errorCount).toBe(1)
    expect(await valid.passesAsync()).toBe(true)
    expect(await invalid.passesAsync()).toBe(false)
    expect(valid.errors.all()).toEqual({})
    expect(invalid.errors.get('contact')).toEqual(['The contact attribute has errors.'])
    await new Promise<void>((resolve) => {
      valid.passes(() => {
        expect(valid.errors.all()).toEqual({})
        resolve()
      })
    })
  })
})
