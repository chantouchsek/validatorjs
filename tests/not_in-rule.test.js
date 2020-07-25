import Validator from '../src'

describe('not_in validation rule', function() {
  it('should fail the value is in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        username: 'chantouch',
      },
      rules: {
        username: 'not_in:chantouch,touch,touch85',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('username')).toEqual('The selected username is invalid.')
  })

  it('should pass when the value is not in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        username: 'chantouch',
      },
      rules: {
        username: 'not_in:user1,user2,user3',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail when the numeric value is in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        id: 1,
      },
      rules: {
        id: 'not_in:0,1,2',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('id')).toEqual('The selected id is invalid.')
  })

  it('should pass when the value is not in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        id: 10,
      },
      rules: {
        id: 'not_in:0,1,2',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the value is undefined', function() {
    const validator = new Validator({
      input: {},
      rules: {
        country: 'not_in:China,Spain,France,Cambodia',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the value is an empty string', function() {
    const validator = new Validator({
      input: {
        country: '',
      },
      rules: {
        country: 'not_in:China,Spain,France,Cambodia',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
