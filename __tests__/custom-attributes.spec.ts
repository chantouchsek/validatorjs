import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('validator custom attribute', () => {
  it('should be able set custom attributes', () => {
    const validator = new Validator(
      { form: { name: null } },
      { form: { name: 'required', age: 'required' } },
      {
        customAttributes: { form: { name: 'Username' } },
        customMessages: {
          required: 'The :attribute need to be filled.',
        },
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('form.name')).toEqual('The Username need to be filled.')
  })

  it('should be able get custom attribute', () => {
    const validator = new Validator(
      { form: { name: null } },
      { form: { name: 'required', age: 'required' } },
      { customAttributes: { form: { name: 'name', age: 'age' } } },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('form.name')).toEqual('The name field is required.')
    expect(validator.errors.first('form.age')).toEqual('The age field is required.')
  })
})
