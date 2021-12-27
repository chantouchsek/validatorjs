import Validator from '../src/main'

describe('alpha validation rule', () => {
  it('should fail with non-alphabetic characters', () => {
    const validator = new Validator({ name: '12' }, { name: 'alpha' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should fail with non-alphabetic characters', () => {
    const validator = new Validator({ name: 12 }, { name: 'alpha' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should pass with only alphabetic characters', () => {
    const validator = new Validator({ name: 'abc' }, { name: 'alpha' })
    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field is an empty string', () => {
    const validator = new Validator({ name: '' }, { name: 'alpha' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', () => {
    const validator = new Validator({}, { name: 'alpha' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
