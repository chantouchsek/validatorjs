import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe.each(['min:1', 'max:30'])('email combined with %s', (size) => {
  it.each([
    0,
    123,
    true,
    false,
    {},
    { address: 'ada@example.com' },
    [],
    ['invalid'],
  ])(
    'rejects invalid input %j without throwing',
    async (value) => {
      for (const rule of [`email|${size}`, `${size}|email`]) {
        const validator = new Validator({ value }, { value: rule })
        expect(validator.passes()).toBe(false)
        expect(validator.fails()).toBe(true)
        await expect(validator.passesAsync()).resolves.toBe(false)
        expect(validator.errors.get('value')).toContain('The value format is invalid.')
        await new Promise<void>(resolve => validator.checkAsync(() => {
          throw new Error('Invalid emails must fail')
        }, resolve))
      }
    },
  )

  it.each(['', null, undefined])('preserves optional input %j', (value) => {
    expect(new Validator({ value }, { value: `email|${size}` }).passes()).toBe(true)
  })
})
