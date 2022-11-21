import Validator from '../src/main'

describe('required with', () => {
  it('should fail', () => {
    const validator = new Validator(
      {
        desert: { first: 'icecream' },
        flavour: '',
      },
      { flavour: 'required_with:desert.first' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual('The flavour field is required when desert first is not empty.')
  })

  it('should pass', () => {
    const validator = new Validator(
      {
        desert: { first: 'icecream' },
        flavour: 'chocolate',
      },
      { flavour: 'required_with:desert.first' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass when with value is empty', () => {
    const validator = new Validator(
      {
        desert: { first: '' },
        flavour: 'chocolate',
      },
      { flavour: 'required_with:desert.first' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
