import Validator from '../src/main'

describe('required if', () => {
  it('should fail', () => {
    const validator = new Validator(
      { desert: 'icecream', flavour: '' },
      { flavour: 'required_if:desert,icecream' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert is icecream.',
    )
  })

  it('should pass', () => {
    const validator = new Validator(
      { desert: 'icecream', flavour: 'chocolate' },
      { flavour: 'required_if:desert,icecream' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass, both value is not the same', () => {
    const validator = new Validator(
      { desert: 'chocolate', flavour: 'icecream' },
      { flavour: 'required_if:desert,icecream' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
