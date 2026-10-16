import { describe, expect, it } from 'vitest'
import { Errors, Validator } from '../src/main'

describe('validation boundary behavior', () => {
  it('selects the first requested field with errors and keeps repeated lookups stable', () => {
    const errors = new Errors()
    errors.fill({ 'email': ['Invalid email'], 'user.name': ['Name required'] })
    expect(errors.get(['missing', 'email', 'user.name'])).toEqual(['Invalid email'])
    expect(errors.get(['missing', 'user.name', 'email'])).toEqual(['Name required'])
    expect(errors.get(['missing', 'email', 'user.name'])).toEqual(['Invalid email'])
    expect(errors.get(['', 'missing'])).toEqual([])
    expect(errors.get([])).toEqual([])
    expect(errors.all()).toEqual({ 'email': ['Invalid email'], 'user.name': ['Name required'] })
  })

  it('deduplicates repeated external errors and allows explicitly forced duplicates', () => {
    const errors = new Errors()
    errors.add('email', 'Unavailable')
    errors.add('email', 'Unavailable')
    expect(errors.get('email')).toEqual(['Unavailable'])
    errors.add('email', 'Unavailable', true)
    expect(errors.get('email')).toEqual(['Unavailable', 'Unavailable'])
    errors.clear('email')
    expect(errors.get('email')).toEqual([])
  })

  it('treats a null wildcard parent as having no children while enforcing parent rules', async () => {
    const optional = new Validator({ users: null }, { 'users.*.name': 'required' })
    expect(optional.passes()).toBe(true)
    expect(optional.errors.all()).toEqual({})
    const required = new Validator({ users: null }, { 'users': 'required|array', 'users.*.name': 'required' })
    await expect(required.passesAsync()).resolves.toBe(false)
    expect(Object.keys(required.errors.all())).toEqual(['users'])
  })

  it('can disable the attribute formatter without changing the validation path', () => {
    const validator = new Validator({ user: { first_name: '' } }, { 'user.first_name': 'required' })
    validator.setAttributeFormatter(undefined)
    expect(validator.fails()).toBe(true)
    expect(validator.errors.first('user.first_name')).toBe('The user.first_name field is required.')
  })

  it('accepts an empty optional inclusion array but rejects it when required', () => {
    expect(new Validator({ roles: [] }, { roles: 'array|in:admin,editor' }).passes()).toBe(true)
    expect(new Validator({ roles: [] }, { roles: 'required|array|in:admin,editor' }).fails()).toBe(true)
  })

  it('keeps empty-value behavior when an inclusion rule is used directly', () => {
    const rule = new Validator({}).getRule('in')
    expect(rule.validate('', {})).toBe(true)
  })

  it.each([
    ['2019-02-28', true],
    ['2019-02-29', false],
    ['2020-02-29', true],
    ['2020-02-30', false],
  ])('checks February boundaries for %s', (date, expected) => {
    const validator = new Validator({ date }, { date: 'required|date' })
    expect(validator.passes()).toBe(expected)
    expect(validator.errorCount).toBe(expected ? 0 : 1)
  })

  it('uses the registered fallback message when an unknown rule rejects input', () => {
    Validator.registerMissedRuleValidator(() => false, 'Rule is not available')
    const validator = new Validator({ field: 'value' }, { field: 'application_rule' })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.first('field')).toBe('Rule is not available')
    expect(validator.errorCount).toBe(1)
  })
})
