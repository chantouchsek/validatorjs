import { describe, expect, it } from 'vitest'
import { isValidDate } from '../src/utils'

describe('utils Object', () => {
  describe('isValidDate', () => {
    it('should return false for empty string', () => {
      expect(isValidDate('')).toBeFalsy()
    })

    it('should return false for whitespace-only string', () => {
      expect(isValidDate('   ')).toBeFalsy()
    })

    it('should return false for invalid date string', () => {
      expect(isValidDate('not-a-date')).toBeFalsy()
    })

    it('should return true for a valid ISO date string', () => {
      expect(isValidDate('2020-01-01')).toBe(true)
    })

    it('should return true for a valid Date instance', () => {
      expect(isValidDate(new Date())).toBe(true)
    })

    it('should return false for an invalid Date instance', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false)
    })

    it('should return false for invalid numeric timestamps', () => {
      expect(isValidDate(Number.NaN)).toBeFalsy()
      expect(isValidDate(Infinity)).toBeFalsy()
      expect(isValidDate(-Infinity)).toBeFalsy()
    })

    it('should return true for a valid numeric timestamp', () => {
      expect(isValidDate(Date.now())).toBe(true)
    })

    it('should return false for null and unsupported types', () => {
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate({} as any)).toBe(false)
    })
  })
})
