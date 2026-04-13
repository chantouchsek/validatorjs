import { describe, expect, it } from 'vitest'
import { hasOwnProperty, isValidDate } from '../src/utils'

describe('utils Object', () => {
  describe('hasOwnProperty', () => {
    it('should hasOwnProperty must be a function', () => {
      expect(typeof hasOwnProperty).toBe('function')
    })
    it('should return false when key is empty', () => {
      expect(hasOwnProperty({}, undefined)).toBeFalsy()
    })
    it('should return false when object is empty', () => {
      expect(hasOwnProperty(undefined, 'key')).toBeFalsy()
    })
    it('should return true when both object and key is not empty', () => {
      expect(hasOwnProperty({ key: 'hello' }, 'key')).toBeTruthy()
    })
  })

  describe('isValidDate', () => {
    it('should return false for empty string', () => {
      expect(isValidDate('')).toBeFalsy()
    })
    it('should return false for whitespace-only string', () => {
      expect(isValidDate('   ')).toBeFalsy()
    })
  })
})
