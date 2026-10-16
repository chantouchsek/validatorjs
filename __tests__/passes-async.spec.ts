import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

type Respond = (passed?: boolean, message?: string) => void

describe('passesAsync()', () => {
  it.each([
    [{ name: 'Ada' }, { name: 'required' }, true],
    [{ name: '' }, { name: 'required' }, false],
    [{}, {}, true],
  ])('returns a Promise for synchronous input %j', async (input, rules, expected) => {
    const result = new Validator(input, rules).passesAsync()
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBe(expected)
  })

  it('preserves synchronous stop-on-error behavior', async () => {
    const validator = new Validator({ email: 'x' }, { email: 'min:5|email' })
    validator.stopOnError(true)
    await expect(validator.passesAsync()).resolves.toBe(false)
    expect(validator.errorCount).toBe(1)
    expect(validator.errors.get('email')).toHaveLength(1)
  })

  it('preserves the synchronous confirmation error destination', async () => {
    const validator = new Validator(
      { password: 'secret', password_confirmation: 'different' },
      { password: 'confirmed' },
      { confirmedReverse: true },
    )
    await expect(validator.passesAsync()).resolves.toBe(false)
    expect(validator.errors.has('password_confirmation')).toBe(true)
    expect(validator.errors.has('password')).toBe(false)
  })

  it('waits for every async rule and preserves a custom failure message', async () => {
    let finishFirst!: Respond
    let finishSecond!: Respond
    Validator.registerAsync('promise_first', (_value: unknown, _req: unknown, _attribute: string, respond: Respond) => {
      finishFirst = respond
    })
    Validator.registerAsync('promise_second', (_value: unknown, _req: unknown, _attribute: string, respond: Respond) => {
      finishSecond = respond
    })
    const validator = new Validator({ name: 'Ada' }, { name: 'required|promise_first|promise_second' })
    const result = validator.passesAsync()
    let settled = false
    void result.then(() => {
      settled = true
    })

    finishSecond(false, 'Name is unavailable')
    await Promise.resolve()
    expect(settled).toBe(false)
    expect(validator.errors.first('name')).toBe('Name is unavailable')
    expect(validator.errorCount).toBe(1)
    finishFirst()
    await expect(result).resolves.toBe(false)
    expect(validator.errorCount).toBe(1)
    expect(validator.errors.first('name')).toBe('Name is unavailable')
  })

  it('handles async rules responding immediately and optional rules being skipped', async () => {
    Validator.registerAsync('promise_immediate', (_value: unknown, _req: unknown, _attribute: string, respond: Respond) => respond())
    const validator = new Validator({ name: 'Ada' }, { name: 'required|promise_immediate', email: 'promise_immediate' })
    await expect(validator.passesAsync()).resolves.toBe(true)
    await expect(new Validator({}, { email: 'promise_immediate' }).passesAsync()).resolves.toBe(true)
  })

  it('clears previous errors on sequential runs without sharing instance state', async () => {
    Validator.registerAsync('promise_name', (value: string, _req: unknown, _attribute: string, respond: Respond) => {
      queueMicrotask(() => respond(value === 'Ada', 'Invalid name'))
    })
    const input = { name: 'Grace' }
    const validator = new Validator(input, { name: 'required|promise_name' })
    const other = new Validator({ name: 'Ada' }, { name: 'required|promise_name' })
    await expect(validator.passesAsync()).resolves.toBe(false)
    await expect(other.passesAsync()).resolves.toBe(true)
    expect(other.errors.all()).toEqual({})
    expect(validator.errorCount).toBe(1)
    input.name = 'Ada'
    await expect(validator.passesAsync()).resolves.toBe(true)
    expect(validator.errorCount).toBe(0)
    expect(validator.errors.all()).toEqual({})
  })

  it('rejects unknown-rule errors instead of treating them as validation failures', async () => {
    const validator = new Validator({ name: 'Ada' }, { name: 'promise_unknown' })
    await expect(validator.passesAsync()).rejects.toThrow('Validator `promise_unknown` is not defined!')
  })

  it.each([false, true])('rejects errors thrown while invoking a rule (async: %s)', async (async) => {
    const error = new Error('Rule configuration failed')
    const rule = async ? 'promise_throw_async' : 'promise_throw_sync'
    const register = async ? Validator.registerAsync.bind(Validator) : Validator.register.bind(Validator)
    register(rule, () => {
      throw error
    })
    const validator = new Validator({ name: 'Ada' }, { name: rule })
    await expect(validator.passesAsync()).rejects.toBe(error)
  })
})
