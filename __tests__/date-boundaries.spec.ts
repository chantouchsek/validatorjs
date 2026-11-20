import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'
import { isValidDate } from '../src/utils'

describe('date calendar boundaries', () => {
  it('preserves ten-character human-readable dates', () => {
    expect(new Validator({ date: 'May 1 2020' }, { date: 'date' }).passes()).toBe(true)
  })

  it.each(['-', '/', '.'])('checks both separators in year-first %s dates', (separator) => {
    for (const [value, expected] of [
      ['2019-02-29', false],
      ['2020-02-30', false],
      ['1900-02-29', false],
      ['2000-02-29', true],
      ['2020-02-29', true],
      ['2020-04-31', false],
      ['2020-06-31', false],
      ['2020-09-31', false],
      ['2020-11-31', false],
      ['2020-04-30', true],
    ] as const) {
      const date = value.replace(/-/g, separator)
      const validator = new Validator({ date }, { date: 'required|date' })
      expect(validator.passes(), date).toBe(expected)
      expect(isValidDate(date), date).toBe(expected)
    }
  })
})

describe.each(['after', 'after_or_equal', 'before', 'before_or_equal'])('%s invalid references', (rule) => {
  it.each([null, undefined, '', 'bad-date', '2019/02/29', '2020.04.31'])(
    'rejects reference %j through sync, Promise, and callback validation',
    async (reference) => {
      const validator = new Validator({ date: '2020-03-01', reference }, { date: `${rule}:reference` })
      expect(validator.passes()).toBe(false)
      expect(validator.fails()).toBe(true)
      await expect(validator.passesAsync()).resolves.toBe(false)
      await new Promise<void>(resolve => validator.checkAsync(() => {
        throw new Error('Invalid date references must fail')
      }, resolve))
      expect(validator.errorCount).toBe(1)
    },
  )

  it('rejects invalid calendar dates in the field under validation', () => {
    expect(new Validator({ date: '2019/02/29', reference: '2020-03-01' }, { date: `${rule}:reference` }).passes()).toBe(false)
  })
})

it('rejects null as a date reference while preserving optional null fields and the numeric epoch', () => {
  expect(isValidDate(null)).toBe(false)
  expect(isValidDate(0)).toBe(true)
  expect(new Validator({ date: null }, { date: 'date' }).passes()).toBe(true)
  expect(new Validator({ date: null }, { date: 'required|date' }).passes()).toBe(false)
  expect(new Validator({ date: 1, reference: 0 }, { date: 'after:reference' }).passes()).toBe(true)
})
