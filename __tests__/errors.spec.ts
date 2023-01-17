import Validator from '../src/main'

describe('Errors', () => {
  it('should get all errors message', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(Object.keys(validator.errors.all())).toHaveLength(1)
  })
  it('should has error message with a field given', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.has('name')).toBeTruthy()
  })
  it('should get first error message with a field given', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('name')).toBe('The name field is required.')
  })
  it('should add message by field given', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    const msg = 'The name field must be input as value.'
    validator.errors.add('name', msg)
    expect(validator.errors.get('name')).toHaveLength(2)
    expect(validator.errors.get('name')[1]).toBe(msg)
  })
  it('should clear all errors', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    validator.errors.flush()
    expect(validator.errors.all()).toEqual({})
  })
  it('errors should be able to fill', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    validator.errors.fill({ name: ['The name field is required'] })
    expect(validator.errors.first('name')).toEqual('The name field is required')
  })
  it('should flush all messages, when call clear without argument', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    validator.errors.clear()
    expect(validator.errors.first('name')).toBeFalsy()
    expect(validator.errors.missed('name')).toBeTruthy()
  })
  it('should clear error by provide field', () => {
    const validator = new Validator(null, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    validator.errors.clear('name')
    expect(validator.errors.first('name')).toBeFalsy()
  })
})
