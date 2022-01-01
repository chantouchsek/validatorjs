import Validator from '../src/main'

describe('Errors', () => {
  it('should get all errors message', () => {
    const validator = new Validator(undefined, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(Object.keys(validator.errors.all())).toHaveLength(1)
  })
  it('should has error message with a field given', () => {
    const validator = new Validator(undefined, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.has('name')).toBeTruthy()
  })
  it('should get first error message with a field given', () => {
    const validator = new Validator(undefined, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('name')).toBe('The name field is required.')
  })
  it('should add message by field given', () => {
    const validator = new Validator(undefined, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    const msg = 'The name field must be input as value.'
    validator.errors.add('name', msg)
    expect(validator.errors.get('name')).toHaveLength(2)
    expect(validator.errors.get('name')[1]).toBe(msg)
  })
})
