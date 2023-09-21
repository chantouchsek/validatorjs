import { describe, expect, it } from 'vitest'
import Validator from '../src/main'

describe('Wildcard', () => {
  describe('Simple Rules ', () => {
    it('should have validation a deep level fails', () => {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                  ],
                },
                {
                  people: [
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          'foo.*.bar.*.people.*.name': 'required',
          'foo.*.bar.*.people.*.age': 'numeric',
          'foo.*.bar.*.people.*.term': 'accepted',
          'foo.*.bar.*.people.*.isActive': 'boolean',
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
                      name: 'Test',
                      age: '100',
                      term: true,
                      isActive: '0',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          'foo.*.bar.*.people.*.name': 'required',
          'foo.*.bar.*.people.*.age': 'numeric',
          'foo.*.bar.*.people.*.term': 'accepted',
          'foo.*.bar.*.people.*.isActive': 'boolean',
        },
      )
      expect(validator.fails()).toBeFalsy()
      expect(validator.passes()).toBeTruthy()
    })
  })
  describe('Rules with dependent of another field', () => {
    it('should have validation fail with required_* and show customMessage', () => {
      const validator = new Validator(
        {
          users: [
            {
              name: 'Tester',
              lastName: '',
              age: '',
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
        'users.0.lastName': ['The users 0 lastName is required when users 0 name is not empty.'],
      })
    })
  })
  it('should it take the custom message if provide', () => {
    const validator = new Validator(
      { conditions: [{ values: null, age: null }] },
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
