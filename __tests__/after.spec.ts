import Validator from '../src/main'

describe('after rule', function () {
  it.skip('should fail when the comparing attribute are greather', function () {
    const validator = new Validator(
      { date: '1996-12-09', date2: '1995-08-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be after date.',
    )
  })

  it.skip('should fail when the comparing attribute are equal', function () {
    const validator = new Validator(
      { date: '1995-08-09', date2: '1995-08-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be after date.',
    )
  })

  it.skip('should pass when the comparing attribute are smaller', function () {
    const validator = new Validator(
      { date: '1995-08-09', date2: '1996-12-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })
})
