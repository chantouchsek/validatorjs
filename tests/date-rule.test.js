import Validator from '../src'

describe('date rule', function() {
  it('should pass for correct, parsable date format', function() {
    const asserts = [
      807926400000,
      'Aug 9, 1995',
      'Wed, 09 Aug 1995 00:00:00 GMT',
      'Wed, 09 Aug 1995 00:00:00',
      '1995-08-09',
      '1995-08-09T00:00:00+00:00',
      '1995-08-09T00:00:00Z',
      '1995-08-09T00:00:00.000Z',
      new Date(),
    ]

    asserts.forEach(function(assert) {
      const validator = new Validator({
        input: {
          date: assert,
        },
        rules: {
          date: 'date',
        },
      })
      expect(validator.passes()).toBeTruthy()
      expect(validator.fails()).not.toBeTruthy()
    })
  })

  it('should pass for correct date formats', function() {
    let validator
    validator = new Validator({
      input: { passingDate: 'Friday, March 17 2017' },
      rules: { passingDate: 'date' },
    })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({
      input: { passingDate: '2017-03-18' },
      rules: { passingDate: 'date' },
    })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({
      input: { passingDate: '2017-03-18' },
      rules: { passingDate: 'date' },
    })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({
      input: { passingDate: '2017.03.18' },
      rules: { passingDate: 'date' },
    })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({
      input: { passingDate: '2017-03-31' },
      rules: { passingDate: 'date' },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail for incorrect date formats', function() {
    let validator

    validator = new Validator({
      input: { failDate: '2014-25-23' },
      rules: { failDate: 'date' },
    })
    expect(validator.fails()).toBeTruthy()

    validator = new Validator({
      input: { failDate: 'foo-bar' },
      rules: { failDate: 'date' },
    })
    expect(validator.fails()).toBeTruthy()

    validator = new Validator({
      input: { failDate: '0908 1995' },
      rules: { failDate: 'date' },
    })
    expect(validator.fails()).toBeTruthy()

    validator = new Validator({
      input: { failDate: '9/39/19' },
      rules: { failDate: 'date' },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should properly check invalid dates', () => {
    let validator
    let invalidDates = [
      '2019-01-32',
      '2019-02-31',
      '2019-03-32',
      '2019-04-31',
      '2019-05-32',
      '2019-06-31',
      '2019-07-32',
      '2019-08-32',
      '2019-09-31',
      '2019-10-32',
      '2019-11-31',
      '2019-12-32',
    ]
    invalidDates.forEach(dateValue => {
      validator = new Validator({
        input: { failDate: dateValue },
        rules: { failDate: 'date' },
      })
      expect(validator.passes()).not.toBeTruthy()
    })

    let validDates = [
      '2019-01-31',
      '2019-02-28',
      '2019-03-31',
      '2019-04-30',
      '2019-05-31',
      '2019-06-30',
      '2019-07-31',
      '2019-08-31',
      '2019-09-30',
      '2019-10-31',
      '2019-11-30',
      '2019-12-31',
    ]
    validDates.forEach(dateValue => {
      validator = new Validator({
        input: { failDate: dateValue },
        rules: { failDate: 'date' },
      })
      expect(validator.passes()).toBeTruthy()
    })
  })

  it('should use custom "isValidDate" rule', () => {
    // NOTE: This test should only be used when running with node as it using `date-fns` node module
    let validator
    if (typeof require !== 'undefined') {
      validator = new Validator()
      validator.register(
        'isValidDate',
        (value) => {
          let { isValid, parseISO } = require('date-fns')
          return isValid(parseISO(value))
        },
        'The :attribute is not a valid date',
      )

      let invalidDates = [
        '2019-01-32',
        '2019-02-31',
        '2019-03-32',
        '2019-04-31',
        '2019-05-32',
        '2019-06-31',
        '2019-07-32',
        '2019-08-32',
        '2019-09-31',
        '2019-10-32',
        '2019-11-31',
        '2019-12-32',
      ]
      invalidDates.forEach(dateValue => {
        validator = new Validator({
          input: { failDate: dateValue },
          rules: { failDate: 'date' },
        })
        expect(validator.passes()).not.toBeTruthy()
      })

      let validDates = [
        '2019-01-31',
        '2019-02-28',
        '2019-03-31',
        '2019-04-30',
        '2019-05-31',
        '2019-06-30',
        '2019-07-31',
        '2019-08-31',
        '2019-09-30',
        '2019-10-31',
        '2019-11-30',
        '2019-12-31',
      ]
      validDates.forEach(dateValue => {
        validator = new Validator({
          input: { failDate: dateValue },
          rules: { failDate: 'isValidDate' },
        })
        expect(validator.passes()).toBeTruthy()
      })
    } else {
      // if running in browser, always pass
      expect(true).toBeTruthy()
    }
  })
})
