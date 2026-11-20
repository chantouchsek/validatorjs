import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('email IPv4 address literals', () => {
  it.each([
    ['ada@[0.0.0.0]', true],
    ['ada@[255.255.255.255]', true],
    ['ada@[127.0.0.1]', true],
    ['ada@[192.168.001.001]', true],
    ['ada@[256.0.0.1]', false],
    ['ada@[1.256.0.1]', false],
    ['ada@[1.0.256.1]', false],
    ['ada@[1.0.0.256]', false],
    ['ada@[999.999.999.999]', false],
    ['ada@[1.2.3]', false],
    ['ada@[1.2.3.4.5]', false],
    ['ada@[1.2.3.-1]', false],
    ['ada@[1.2.3.a]', false],
    ['ada@[0000.0.0.1]', false],
    ['ada@example.com', true],
    ['"ada@[999.999.999.999]"@example.com', true],
    ['"ada@work"@[127.0.0.1]', true],
    ['"ada@[999.999.999.999]"@[127.0.0.1]', true],
    ['"ada@work"@[256.0.0.1]', false],
    ['', true],
    [null, true],
    [undefined, true],
  ])('checks %j', async (value, expected) => {
    const validator = new Validator({ value }, { value: 'email' })
    expect(validator.passes()).toBe(expected)
    expect(validator.fails()).toBe(!expected)
    await expect(validator.passesAsync()).resolves.toBe(expected)
    if (!expected) expect(validator.errors.first('value')).toBe('The value format is invalid.')
  })
})
