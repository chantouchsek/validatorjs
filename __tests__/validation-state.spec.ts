import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('validation state isolation', () => {
  it('does not expand wildcard messages into shared or frozen options', () => {
    const customMessages = Object.freeze({ 'required.users.*.name': 'Name required' })
    const options = { customMessages }
    const rules = { 'users.*.name': 'required' }
    const first = new Validator({ users: [{ name: '' }] }, rules, options)
    const second = new Validator({ users: [{ name: '' }, { name: '' }] }, rules, options)
    expect(first.fails()).toBe(true)
    expect(second.fails()).toBe(true)
    expect(first.messages.customMessages).not.toBe(second.messages.customMessages)
    expect(first.errors.first('users.0.name')).toBe('Name required')
    expect(second.errors.first('users.1.name')).toBe('Name required')
    expect(first.errors.has('users.1.name')).toBe(false)
    expect(customMessages).toEqual({ 'required.users.*.name': 'Name required' })
  })

  it('counts only the current run when passes and fails are repeated', () => {
    const validator = new Validator({}, { name: 'required' })
    expect(validator.passes()).toBe(false)
    expect(validator.fails()).toBe(true)
    expect(validator.errorCount).toBe(1)
    expect(validator.errors.get('name')).toHaveLength(1)
  })

  it('returns validated nested and wildcard data after correcting input', () => {
    const input = { user: { name: '' }, items: [{ value: '', secret: 'hidden' }] }
    const validator = new Validator(input, { 'user.name': 'required', 'items.*.value': 'required' })
    const errors = validator.errors
    expect(validator.fails()).toBe(true)
    input.user.name = 'Ada'
    input.items[0].value = 'visible'
    expect(validator.passes()).toBe(true)
    expect(validator.fails()).toBe(false)
    expect(validator.errorCount).toBe(0)
    expect(validator.errors).toBe(errors)
    expect(errors.all()).toEqual({})
    expect(validator.validated()).toEqual({ user: { name: 'Ada' }, items: [{ value: 'visible' }] })
  })

  it('replaces errors on sequential asynchronous runs', async () => {
    Validator.registerAsync('state_name', (value: string, _req: unknown, _attribute: string, respond: (passed: boolean) => void) => {
      queueMicrotask(() => respond(value === 'Ada'))
    }, 'Invalid name')
    const input = { name: 'Grace' }
    const validator = new Validator(input, { name: 'required|state_name' })
    const run = () => new Promise<boolean>(resolve => validator.checkAsync(() => resolve(true), () => resolve(false)))
    expect(await run()).toBe(false)
    expect(await run()).toBe(false)
    expect(validator.errorCount).toBe(1)
    input.name = 'Ada'
    expect(await run()).toBe(true)
    expect(validator.errorCount).toBe(0)
    expect(validator.errors.all()).toEqual({})
  })
})
