import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('wildcard', () => {
  describe('simple Rules ', () => {
    it('should have validation a deep level fails', () => {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      age: 'aa',
                      isActive: 'not',
                      name: '',
                      term: false,
                    },
                    {
                      age: 'aa',
                      isActive: 'not',
                      name: '',
                      term: false,
                    },
                  ],
                },
                {
                  people: [
                    {
                      age: 'aa',
                      isActive: 'not',
                      name: '',
                      term: false,
                    },
                    {
                      age: 'aa',
                      isActive: 'not',
                      name: '',
                      term: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          'foo.*.bar.*.people.*.age': 'numeric',
          'foo.*.bar.*.people.*.isActive': 'boolean',
          'foo.*.bar.*.people.*.name': 'required',
          'foo.*.bar.*.people.*.term': 'accepted',
        },
      )
      expect(validator.fails()).toBeTruthy()
      expect(validator.passes()).toBeFalsy()
    })
    it('should have validation a deep level passes', () => {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      age: '100',
                      isActive: '0',
                      name: 'Test',
                      term: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          'foo.*.bar.*.people.*.age': 'numeric',
          'foo.*.bar.*.people.*.isActive': 'boolean',
          'foo.*.bar.*.people.*.name': 'required',
          'foo.*.bar.*.people.*.term': 'accepted',
        },
      )
      expect(validator.fails()).toBeFalsy()
      expect(validator.passes()).toBeTruthy()
    })
  })
  describe('rules with dependent of another field', () => {
    it('should have validation fail with required_* and show customMessage', () => {
      const validator = new Validator(
        {
          users: [
            {
              age: '',
              lastName: '',
              name: 'Tester',
              requiredAge: 'true',
            },
          ],
        },
        {
          'users.*.age': 'required_if:users.*.requiredAge,true',
          'users.*.lastName': 'required_with:users.*.name',
        },
        {
          customMessages: {
            'required_if.users.*.age': 'Required',
          },
        },
      )
      expect(validator.fails()).toBeTruthy()
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.all()).toEqual({
        'users.0.age': ['Required'],
        'users.0.lastName': ['The users 0 lastName field is required when users 0 name is not empty.'],
      })
    })
  })
  it('should it take the custom message if provide', () => {
    const validator = new Validator(
      { conditions: [{ age: null, values: null }] },
      { 'conditions.*.values': 'required' },
      { customMessages: { 'required.conditions.*.values': 'Required' } },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.all()).toEqual({
      'conditions.0.values': ['Required'],
    })
  })
})
