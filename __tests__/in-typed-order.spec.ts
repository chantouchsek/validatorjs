import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('typed inclusion parameters', () => {
  it.each([0, 1, false, true])('finds %j regardless of a preceding string parameter', async (value) => {
    for (const list of [[value, 'other'], ['other', value], ['other', 'another', value]]) {
      const validator = new Validator({ value }, { value: [{ in: list }] })
      expect(validator.passes()).toBe(true)
      expect(validator.fails()).toBe(false)
      await expect(validator.passesAsync()).resolves.toBe(true)
      await new Promise<void>(resolve => validator.passes(resolve))
    }
  })

  it.each([
    [1, ['other', 2], false],
    ['1', ['other', 1], false],
    [1, ['1'], true],
    [0, ['0'], true],
    ['other', ['other', 1], true],
    [[1], [1, 2], true],
    [[1], ['1', 2], false],
  ])('preserves scalar and array matching for %j in %j', async (value, list, expected) => {
    const validator = new Validator({ value }, { value: [{ in: list }] })
    expect(validator.passes()).toBe(expected)
    await expect(validator.passesAsync()).resolves.toBe(expected)
    const callbackResult = await new Promise<boolean>(resolve => validator.checkAsync(
      () => resolve(true),
      () => resolve(false),
    ))
    expect(callbackResult).toBe(expected)
    if (!expected) expect(validator.errors.first('value')).toBe('The selected value is invalid.')
  })
})
