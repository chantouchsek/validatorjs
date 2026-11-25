import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('regex flag parsing', () => {
  it.each([
    ['a\nb', '/^a.b$/s', true],
    ['a\nb', '/^a.b$/', false],
    ['😀', '/^.$/u', true],
    ['😀', '/^.$/', false],
    ['a', '/a/y', true],
    ['ba', '/a/y', false],
    ['A\nb', '/^a.b$/gimsuy', true],
    ['a', '/^a$/d', true],
    ['a', '/^[a]$/v', true],
    ['b', '/^[a]$/v', false],
    ['a/b', '/^a\\/b$/uy', true],
    ['abc', '/^abc$/gim', true],
  ])('matches %j with %s', async (value, pattern, expected) => {
    const validator = new Validator({ value }, {
      value: [`regex:${pattern}`],
    })
    expect(validator.passes()).toBe(expected)
    expect(validator.passes()).toBe(expected)
    expect(validator.fails()).toBe(!expected)
    await expect(validator.passesAsync()).resolves.toBe(expected)
  })
})
