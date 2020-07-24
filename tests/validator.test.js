import Validator from '../src'

describe('Validator constructor', () => {
  let validator
  beforeEach(() => {
    validator = new Validator({
      input: {
        name: 'David',
        email: 'david@gmail.com',
      },
      rules: {
        name: 'required',
        email: 'required',
      },
      customMessages: {
        required: 'You\re missing :required',
      },
    })
  })
  it('should expose on window if browser', () => {
    if (typeof window !== 'undefined') {
      expect(window.Validator).not.toBeUndefined()
    }
  })
  it('should have a rules property containing all the validation rules', function() {
    expect(typeof validator.rules).toBe('object')
  })
  it('should have an input property containing the input data to be validated', function() {
    expect(typeof validator.input).toBe('object')
  })
  it('should have a messages property containing the combined messages for validation', function() {
    expect(typeof validator.messages).toBe('object')
  })
  it('should have a passes() method', function() {
    expect(typeof validator.passes).toBe('function')
  })
  it('should have a fails() method', function() {
    expect(typeof validator.fails).toBe('function')
  })
  it('should have a check method', function() {
    expect(typeof validator.check).toBe('function')
  })
  it('should handle undefined data', function() {
    const validator = new Validator({
      input: undefined,
      rules: { name: 'required' }
    })
    validator.fails()
  })
  it('should handle null data', function() {
    const validator = new Validator({
      input: undefined,
      rules: { name: 'required' }
    })
    validator.fails()
  })
})
