import Validator from '../src/main'

describe('alternative initialization using an array instead pipe', () => {
  let validator: Validator
  beforeEach(() => {
    validator = new Validator(
      {
        name: 'David',
        email: 'johndoe@gmail.com',
        salary: '10,000.00',
        birthday: '03/07/1980',
        nick: 'Dav',
      },
      {
        name: ['required', 'min:3', 'max:10'],
        email: ['required', 'email'],
        salary: ['required', 'regex:/^\\$?(?!0.00)(([0-9]{1,3},([0-9]{3},)*)[0-9]{3}|[0-9]{1,3})(\\.[0-9]{2})?$/'],
        birthday: [
          'required',
          'regex:/^([1-9]|0[1-9]|[12][0-9]|3[01])\\D([1-9]|0[1-9]|1[012])\\D(19[0-9][0-9]|20[0-9][0-9])$/',
        ],
        nick: ['required', 'regex:/^X/'],
      },
    )
  })

  it('should fail 1 validation rule', () => {
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('nick')).toEqual('The nick format is invalid.')
  })
}) // Page constructor
