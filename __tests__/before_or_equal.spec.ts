import Validator from '../src/main'

describe('before or equal rule', function () {
  it('should fail when the comparing attribute are smaller', function () {
    const validator = new Validator({ date: '1994-12-09', date2: '1998-08-09' }, { date2: 'before_or_equal:date' })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual('The date2 must be equal or before date.')
  })

  it('should pass when the comparing attribute are equal', function () {
    const validator = new Validator({ date: '1994-12-09', date2: '1994-12-09' }, { date2: 'before_or_equal:date' })

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the comparing attribute are greather', function () {
    const validator = new Validator({ date: '1998-08-09', date2: '1994-12-09' }, { date2: 'before_or_equal:date' })

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when date is invalid', function () {
    const validator = new Validator({ date: 'invalid-date', date2: '1994-12-09' }, { date2: 'before_or_equal:date' })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })
})
