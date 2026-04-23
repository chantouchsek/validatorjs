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
    it('should return false for invalid numeric timestamps', () => {
      expect(isValidDate(Number.NaN)).toBeFalsy()
      expect(isValidDate(Infinity)).toBeFalsy()
      expect(isValidDate(-Infinity)).toBeFalsy()
    })
  })
})
