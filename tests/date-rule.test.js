import Validator from '../src'

describe("date rule", function () {
  it("should pass for correct, parsable date format", function () {
    const asserts = [
      807926400000,
      'Aug 9, 2020',
      'Wed, 09 Aug 2020 00:00:00 GMT',
      'Wed, 09 Aug 2020 00:00:00',
      '2020-08-09',
      '2020-08-09T00:00:00+00:00',
      '2020-08-09T00:00:00Z',
      '2020-08-09T00:00:00.000Z',
      new Date(),
    ]

    for (const date of asserts) {
      const validator = new Validator({ input: { date }, rules: { date: 'date'} })
      expect(validator.passes()).toBeTruthy()
      expect(validator.fails()).toBeFalsy()
    }
  })

  it("should pass for correct date formats", function () {
    let validator

    validator = new Validator({ input: { passingDate: 'Friday, March 17 2017' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({ input: { passingDate: '2017-03-18' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({ input: { passingDate: '2017-03-18' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({ input: { passingDate: '2017.03.18' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()

    validator = new Validator({ input: { passingDate: '2017-03-31' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()
  })

  it("should fail for incorrect date formats", function () {
    let validator

    validator = new Validator({ input: { failDate: '2014-25-23' }, rules: { failDate: 'date' } })
    expect(validator.fails()).toBeTruthy()

    validator = new Validator({ input: { failDate: 'foo-bar' }, rules: { failDate: 'date' } })
    expect(validator.fails()).toBeTruthy()

    validator = new Validator({ input: { failDate: '0908 2020' }, rules: { failDate: 'date' } })
    expect(validator.fails()).toBeTruthy()

    validator = new Validator({ input: { failDate: '9/39/2020' }, rules: { failDate: 'date' } })
    expect(validator.fails()).toBeTruthy()
  })

  it("should properly check invalid dates", () => {
    let invalidDates = [
      "2020-01-32",
      "2019-02-31",
      "2020-02-31",
      "2020-03-32",
      "2020-04-31",
      "2020-05-32",
      "2020-06-31",
      "2020-07-32",
      "2020-08-32",
      "2020-09-31",
      "2020-10-32",
      "2020-11-31",
      "2020-12-32"
    ]
    for (const failDate of invalidDates) {
      const validator = new Validator({ input: { failDate }, rules: { failDate: 'date' } })
      expect(validator.passes()).toBeFalsy()
    }

    let validDates = [
      "2020-01-31",
      "2020-02-28",
      "2020-03-31",
      "2020-04-30",
      "2020-05-31",
      "2020-06-30",
      "2020-07-31",
      "2020-08-31",
      "2020-09-30",
      "2020-10-31",
      "2020-11-30",
      "2020-12-31"
    ]
    for (const failDate of validDates) {
      const validator = new Validator({ input: { failDate }, rules: { failDate: 'date' } })
      expect(validator.passes()).toBeTruthy()
    }
  })

  it("should support alternate date formats", () => {
    let validator

    validator = new Validator({ input: { passingDate: '2020.09.26' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()
    validator = new Validator({ input: { passingDate: '2020/09/26' }, rules: { passingDate: 'date' } })
    expect(validator.passes()).toBeTruthy()
  })
})
