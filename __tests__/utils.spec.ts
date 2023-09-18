import { describe, expect, it } from 'vitest'
import { hasOwnProperty } from '../src/utils'

describe('Utils Object', () => {
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
})
