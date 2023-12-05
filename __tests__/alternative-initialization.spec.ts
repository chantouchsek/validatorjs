import { beforeEach, describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('alternative initialization using an array instead pipe', () => {
  let validator: Validator
  beforeEach(() => {
    validator = new Validator(
      {
        birthday: '03/07/1980',
        email: 'johndoe@gmail.com',
        name: 'David',
        nick: 'Dav',
        salary: '10,000.00',
      },
      {
        birthday: [
          'required',
          'regex:/^([1-9]|0[1-9]|[12][0-9]|3[01])\\D([1-9]|0[1-9]|1[012])\\D(19[0-9][0-9]|20[0-9][0-9])$/',
        ],
        email: ['required', 'email'],
        name: ['required', 'min:3', 'max:10'],
        nick: ['required', 'regex:/^X/'],
        salary: ['required', 'regex:/^\\$?(?!0.00)(([0-9]{1,3},([0-9]{3},)*)[0-9]{3}|[0-9]{1,3})(\\.[0-9]{2})?$/'],
      },
    )
  })

  it('should fail 1 validation rule', () => {
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('nick')).toEqual('The nick format is invalid.')
  })
}) // Page constructor
