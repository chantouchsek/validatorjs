import Validator from '../src/main'

describe('digits rule', () => {
  it('should be numeric and must have an exact length of 5', () => {
    const validation = new Validator({ zip: '90989' }, { zip: 'digits:5' })

    expect(validation.passes()).toBeTruthy()
    expect(validation.fails()).toBeFalsy()
  })

  it('should not pass if non-digits are present', () => {
    const validation = new Validator({ zip: '9098a' }, { zip: 'digits:5' })

    expect(validation.fails()).toBeTruthy()
    expect(validation.errors.first('zip')).toEqual('The zip must be 5 digits.')
    expect(validation.passes()).toBeFalsy()
  })

  it('should not pass if spaces are present', () => {
    let validation = new Validator(
      {
        zip: '9098 ',
      },
      {
        zip: 'digits:5',
      },
    )

    expect(validation.fails()).toBeTruthy()
    expect(validation.errors.first('zip')).toEqual('The zip must be 5 digits.')
    expect(validation.passes()).toBeFalsy()

    validation = new Validator(
      {
        zip: ' 9098',
      },
      {
        zip: 'digits:5',
      },
    )

    expect(validation.fails()).toBeTruthy()
    expect(validation.errors.first('zip')).toEqual('The zip must be 5 digits.')
    expect(validation.passes()).toBeFalsy()
  })
})
