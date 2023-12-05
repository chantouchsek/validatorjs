import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('numeric validation rule', () => {
  it('should pass with a numeric value', () => {
    const validator = new Validator({ age: 44 }, { age: 'numeric' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a decimal numeric value', () => {
    const validator = new Validator({ measurement: 0.5454 }, { measurement: 'numeric' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string numeric value', () => {
    const validator = new Validator({ age: '44' }, { age: 'numeric' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with a string decimal numeric value', () => {
    const validator = new Validator({ measurement: '0.5454' }, { measurement: 'numeric' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with a string value', () => {
    const validator = new Validator({ age: '18something' }, { age: 'numeric' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with an array value', () => {
    const validator = new Validator({ age: [13] }, { age: 'numeric' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should fail with a boolean true value', () => {
    const validator = new Validator({ age: true }, { age: 'numeric' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with a boolean false value', () => {
    const validator = new Validator(
      {
        age: false,
      },
      {
        age: 'numeric',
      },
    )
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with no value', () => {
    const validator = new Validator(
      {},
      {
        age: 'numeric',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass with an empty string value', () => {
    const validator = new Validator({ age: '' }, { age: 'numeric' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass when combine with digits', () => {
    const validator = new Validator({ age: '12345' }, { age: 'numeric|digits:5' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should be failed when combine with digits', () => {
    const validator = new Validator({ age: '1234.5' }, { age: 'numeric|digits:5' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })
})
