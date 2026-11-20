import { describe, expect, it } from 'vitest'
import { Errors, Validator } from '../src/main'
import { flattenObject } from '../src/utils'

describe.each(['__proto__', 'constructor', 'toString', 'hasOwnProperty'])('field named %s', (field) => {
  it('validates and renders errors without losing keys or changing prototypes', async () => {
    const rules = { [field]: 'required' }
    const validator = new Validator({ [field]: '' }, rules)
    expect(Object.keys(validator.rules)).toEqual([field])
    expect(Object.getPrototypeOf(validator.rules)).toBe(Object.prototype)
    expect(validator.passes()).toBe(false)
    expect(validator.fails()).toBe(true)
    await expect(validator.passesAsync()).resolves.toBe(false)
    await new Promise<void>(resolve => validator.checkAsync(() => {
      throw new Error('Empty required fields must fail')
    }, resolve))
    expect(validator.errorCount).toBe(1)
    expect(validator.errors.get(field)).toHaveLength(1)
    expect(Object.keys(validator.errors.all())).toEqual([field])
    expect(Object.getPrototypeOf(validator.errors.all())).toBe(Object.prototype)
    expect(validator.errors.first(field)).not.toContain('function ')

    expect(new Validator({ [field]: 'value' }, rules).validated()).toEqual({ [field]: 'value' })
  })

  it('stores, deduplicates, fills, and clears own errors safely', () => {
    const errors = new Errors()
    errors.fill({ [field]: ['First'] })
    expect(Object.getPrototypeOf(errors.all())).toBe(Object.prototype)
    expect(errors.first(field)).toBe('First')
    errors.add(field, 'Second')
    errors.add(field, 'Second')
    expect(errors.get(field)).toEqual(['Second', 'First'])
    errors.clear(field)
    expect(errors.get(field)).toEqual([])
    errors.add(field, 'Third')
    expect(errors.get(field)).toEqual(['Third'])
    expect(Object.getPrototypeOf(errors.all())).toBe(Object.prototype)
    errors.flush()
    expect(errors.all()).toEqual({})
  })

  it('preserves own flattened leaf values and explicit custom attribute names', () => {
    const flat = flattenObject({ [field]: [] })
    expect(Object.keys(flat)).toEqual([field])
    expect(flat[field]).toEqual([])
    expect(Object.getPrototypeOf(flat)).toBe(Object.prototype)
    const validator = new Validator({ [field]: '' }, { [field]: 'required' }, {
      customAttributes: { [field]: 'label' },
    })
    expect(validator.fails()).toBe(true)
    expect(validator.errors.first(field)).toBe('The label field is required.')
  })
})

it('keeps an empty __proto__ object as an own flattened value', () => {
  const flat = flattenObject({ ['__proto__']: {} })
  expect(Object.keys(flat)).toEqual(['__proto__'])
  expect(Object.getOwnPropertyDescriptor(flat, '__proto__')?.value).toEqual({})
  expect(Object.getPrototypeOf(flat)).toBe(Object.prototype)
})
