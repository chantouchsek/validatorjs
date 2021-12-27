import Validator from '../src/main'

describe('required unless', () => {
  it('should fail', () => {
    const validator = new Validator(
      { desert: 'icecream', flavour: '' },
      { flavour: 'required_unless:desert,cake' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert is not cake.',
    )
  })

  it('should pass', () => {
    const validator = new Validator(
      { desert: 'icecream', flavour: 'chocolate' },
      { flavour: 'required_unless:desert,cake' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
