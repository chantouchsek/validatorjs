import Validator from '../src'

describe('before or equal rule', function() {
  it('should fail when the comparing attribute are smaller', function() {
    const validator = new Validator({
      input: {
        date: '1994-12-09',
        date2: '1998-08-09',
      },
      rules: {
        date2: 'before_or_equal:date',
      },
    })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.has(['date2'])).toBeTruthy()
    expect(validator.errors.first(['abc', 'date2'])).toEqual('The date2 must be equal or before date.')
  })

  it('should pass when the comparing attribute are equal', function() {
    const validator = new Validator({
      input: {
        date: '1994-12-09',
        date2: '1994-12-09',
      },
      rules: {
        date2: 'before_or_equal:date',
      },
    })

    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the comparing attribute are greater', function() {
    const validator = new Validator({
      input: {
        date: '1998-08-09',
        date2: '1994-12-09',
      },
      rules: {
        date2: 'before_or_equal:date',
      },
    })

    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
})
