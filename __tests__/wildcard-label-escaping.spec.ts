import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('literal punctuation in wildcard attribute labels', () => {
  it.each([
    ['a[0', 'a[*'],
    ['a(0', 'a(*'],
    ['a+0', 'a+*'],
    ['a?0', 'a?*'],
    ['a$0', 'a$*'],
    ['a^0', 'a^*'],
    ['a{0', 'a{*'],
    ['a}0', 'a}*'],
    ['a|0', 'a|*'],
    ['a\\0', 'a\\*'],
    ['a]0', 'a]*'],
    ['(a+)+suffix', '(a+)+*'],
    ['users.0.name', 'users.*.name'],
  ])('matches field %j with label pattern %j', async (field, pattern) => {
    const validator = new Validator({ [field]: '' }, { [field]: 'required' }, {
      customAttributes: { [pattern]: 'label' },
    })
    expect(validator.passes()).toBe(false)
    expect(validator.errors.first(field)).toBe('The label field is required.')
    await expect(validator.passesAsync()).resolves.toBe(false)
    expect(validator.errors.first(field)).toBe('The label field is required.')
  })

  it('does not interpret path separators as arbitrary characters', () => {
    const validator = new Validator({ usersX0Xname: '' }, { usersX0Xname: 'required' }, {
      customAttributes: { 'users.*.name': 'label' },
    })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.first('usersX0Xname')).toBe('The usersX0Xname field is required.')
  })

  it('preserves multiple wildcards, exact labels, and nonmatching labels', () => {
    const validator = new Validator({ 'a.0.b.1': '', 'a.1.b.0': '', 'other': '' }, {
      'a.0.b.1': 'required',
      'a.1.b.0': 'required',
      'other': 'required',
    }, {
      customAttributes: { 'a.*.b.*': 'wild label', 'a.0.b.1': 'exact label' },
    })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.first('a.0.b.1')).toBe('The exact label field is required.')
    expect(validator.errors.first('a.1.b.0')).toBe('The wild label field is required.')
    expect(validator.errors.first('other')).toBe('The other field is required.')
  })
})
