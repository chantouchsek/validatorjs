import Validator from '../src'

describe('digits rule', function() {
  it('should be numeric and must have an exact length of 5', function() {
    const validation = new Validator({
      input: {
        zip: '90989',
      },
      rules: {
        zip: 'digits:5',
      },
    })

    expect(validation.passes()).toBeTruthy()
    expect(validation.fails()).not.toBeTruthy()
  })

  it('should not pass if non-digits are present', function() {
    const validation = new Validator({
      input: {
        zip: '9098a',
      },
      rules: {
        zip: 'digits:5',
      },
    })

    expect(validation.fails()).toBeTruthy()
    expect(validation.errors.first('zip')).toEqual('The zip must be 5 digits.')
    expect(validation.passes()).not.toBeTruthy()
  })
})
