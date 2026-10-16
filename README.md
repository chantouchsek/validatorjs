# ValidatorJs

[![ci](https://github.com/chantouchsek/validatorjs/actions/workflows/ci.yml/badge.svg)](https://github.com/chantouchsek/validatorjs/actions/workflows/ci.yml)
[![Latest Version on NPM](https://img.shields.io/npm/v/@chantouchsek/validatorjs.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/validatorjs)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/@chantouchsek/validatorjs.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/validatorjs)
[![npm](https://img.shields.io/npm/dm/@chantouchsek/validatorjs.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/validatorjs)
[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

The ValidatorJs library makes data validation in JavaScript very easy in both the browser and Node.js. This library was
forked from [ValidatorJs](https://github.com/mikeerickson/validatorjs) to re-write in typescript to add more rules and
features.

## Why use ValidatorJs?

- Works in both the browser and Node.
- Readable and declarative validation rules.
- Error messages with multilingual support.
- CommonJS/Browserify support.
- ES6 support.
- Re-written in Typescript

## Installation

### Using pnpm

```bash
pnpm add @chantouchsek/validatorjs
```

### Using npm

```bash
npm install @chantouchsek/validatorjs
```

### Using yarn

```bash
yarn add @chantouchsek/validatorjs
```

### Basic Usage

```ts
import { Validator } from '@chantouchsek/validatorjs'

const data = { email: 'ada@example.com' }
const rules = { email: 'required|email' }
const options = { customAttributes: { email: 'Email address' } }
const validation = new Validator(data, rules, options)
validation.passes() // => true
```

**data** {Object} - The data you want to validate

**rules** {Object} - Validation rules

**options** {Object} - Optional validation and message configuration

- Options
  - locale?: LangTypes | Select a bundled locale
  - confirmedReverse?: boolean | Optional showing error message on confirmation field instead of password
  - customMessages?: Record<string, any> | Optional custom error messages to return
  - customAttributes?: Record<string, any> | Optional custom attribute name to return
  - defaultAttributeName?: Partial<Record<LangTypes, string>> | Replace :attribute for the selected locale

Examples below use TypeScript and the package's named `Validator` export. Synchronous
`passes()` and `fails()` return booleans; callback-based validation returns `void`.
`passesAsync()` always returns `Promise<boolean>` for either kind of rule.
Each validation run replaces the instance's previous errors and error count.

#### Example 1 - Passing Validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const data = {
  age: 28,
  email: 'johndoe@gmail.com',
  name: 'John',
}

const rules = {
  age: 'min:18',
  email: 'required|email',
  name: 'required',
}

const validation = new Validator(data, rules)

validation.passes() // => true
validation.fails() // => false
```

To apply validation rules to the _data_ object, use the same object key names for the _rules_ object.

#### Example 2 - Failing Validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validation = new Validator(
  {
    email: 'not an email address.com',
    name: 'D',
  },
  {
    email: 'required|email',
    name: 'size:3',
  },
)

validation.fails() // => true
validation.passes() // => false

// Error messages
validation.errors.first('email') // => 'The email format is invalid.'
validation.errors.get('email') // => ['The email format is invalid.']
validation.errors.has('name') // => true
validation.errorCount // => 2
validation.errors.all() // => { email: ['The email format is invalid.'], name: ['The name must be 3 characters.'] }
```

#### Example 3 - With Default Attribute Name

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validation = new Validator(
  {
    email: 'not an email address.com',
    name: 'D',
  },
  {
    email: 'required|email',
    name: 'size:3',
  },
  {
    locale: 'ja',
    defaultAttributeName: {
      en: '',
      ja: 'この項目',
    },
  },
)

validation.fails() // => true
validation.passes() // => false

// Error messages
validation.errors.first('email') // => 'この項目は正しいメールアドレスを入力してください。'
```

### Optional fields, required, sometimes, and present

An ordinary rule such as `email` skips missing, `undefined`, `null`, and empty-string
values. Add `required` to reject them. `sometimes` skips the entire field only when
the key is missing; an explicitly supplied empty value still runs `required`.
`present` currently rejects both missing keys and `undefined`, but accepts `null`,
empty strings, zero, false, and empty arrays.

```ts
import { Validator } from '@chantouchsek/validatorjs'

new Validator({}, { email: 'email' }).passes() // => true
new Validator({ email: '' }, { email: 'email' }).passes() // => true
new Validator({}, { email: 'required|email' }).passes() // => false
new Validator({}, { email: 'sometimes|required|email' }).passes() // => true
new Validator({ email: '' }, { email: 'sometimes|required|email' }).passes() // => false
new Validator({ email: undefined }, { email: 'sometimes|required' }).passes() // => false
new Validator({ email: null }, { email: 'present' }).passes() // => true
new Validator({ email: undefined }, { email: 'present' }).passes() // => false
new Validator({}, { email: 'present' }).passes() // => false
new Validator({ count: 0, enabled: false }, { count: 'required', enabled: 'required' }).passes() // => true
new Validator({ tags: [] }, { tags: 'required|array' }).passes() // => false
```

`required` checks the non-whitespace string representation, so zero and false pass
and an empty array fails. Arrays still run ordinary rules even when empty.
Validation does not coerce input types: a numeric string can pass `numeric` while
remaining a string in the returned data.

### Nested Rules

Nested objects can also be validated. There are two ways to declare validation rules for nested objects. The first way
is to declare the validation rules with a corresponding nested object structure that reflects the data. The second way
is to declare validation rules with flattened key names. For example, to validate the following data:

```ts
import { Validator } from '@chantouchsek/validatorjs'

const data = {
  bio: {
    age: 28,
    education: {
      primary: 'Elementary School',
      secondary: 'Secondary School',
    },
  },
  name: 'John',
}
// Either nested rules or flattened paths can validate this data.
const nested = {
  bio: {
    age: 'min:18',
    education: {
      primary: 'string',
      secondary: 'string',
    },
  },
  name: 'required',
}

// OR

const flattened = {
  'bio.age': 'min:18',
  'bio.education.primary': 'string',
  'bio.education.secondary': 'string',
  'name': 'required',
}

new Validator(data, nested).passes() // => true
new Validator(data, flattened).passes() // => true
```

### WildCards Rules

WildCards can also be validated.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const data = {
  users: [
    {
      bio: {
        age: 28,
        education: {
          primary: 'Elementary School',
          secondary: 'Secondary School',
        },
      },
      name: 'John',
    },
  ],
}
const rules = {
  'users': 'required|array',
  'users.*.bio.age': 'min:18',
  'users.*.bio.education.primary': 'string',
  'users.*.bio.education.secondary': 'string',
  'users.*.name': 'required',
}

new Validator(data, rules).passes() // => true

const invalid = new Validator({ users: [{ name: '' }] }, { 'users.*.name': 'required' })
invalid.fails() // => true
invalid.errors.first('users.0.name') // => 'The users 0 name field is required.'
```

Use a rule on the parent array to require at least one item: wildcard rules alone
have no entries to validate for a missing or empty array. Wildcards expand when
the validator is constructed; create a new instance if the array structure changes.

### Conditional required rules and comparisons

String-form comparison parameters are strings. Array-form parameters preserve
their types, so use them when comparing a boolean or number.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const input = {
  account: { kind: 'business' },
  company: '',
  password: 'secret123',
  password_confirmation: 'secret123',
  email: 'ada@example.com',
  emailAgain: 'ada@example.com',
  backupEmail: 'other@example.com',
}
const rules = {
  company: 'required_if:account.kind,business',
  password: 'required|confirmed',
  emailAgain: 'required|same:email',
  backupEmail: 'required|different:email',
}
const validation = new Validator(input, rules)
validation.fails() // => true
validation.errors.has('company') // => true
validation.errorCount // => 1

new Validator({ enabled: false }, { reason: [{ required_if: ['enabled', false] }] }).passes() // => false
new Validator({ status: 'draft' }, { title: 'required_unless:status,draft' }).passes() // => true
new Validator({ email: 'ada@example.com' }, { name: 'required_with:email' }).passes() // => false
new Validator({ email: 'ada@example.com' }, { name: 'required_without:email' }).passes() // => true
new Validator({ first: 'Ada', last: 'Lovelace' }, { name: 'required_with_all:first,last' }).passes() // => false
new Validator({ first: 'Ada' }, { name: 'required_without_all:first,last' }).passes() // => true

const users = { users: [{ needsPhone: true, phone: '' }, { needsPhone: false }] }
const userRules = { 'users.*.phone': [{ required_if: ['users.*.needsPhone', true] }] }
const perUser = new Validator(users, userRules)
perUser.fails() // => true
Object.keys(perUser.errors.all()) // => ['users.0.phone']
```

`same` and `different` use strict equality. Current limitations: comparison paths
through arrays do not resolve correctly for these two rules, and `confirmed`
looks up a top-level confirmation field. The with/without conditional rules use
truthiness, so zero and false count as absent. Although their rule names below
document multiple fields, `required_with` and `required_without` currently resolve
only one path; use a single dependency until list handling is fixed.

### Available Rules

Validation rules do not have an implicit 'required'. If a field is _undefined_ or an empty string, it will pass
validation. If you want a validation to fail for undefined or '', use the _required_ rule.

#### accepted

The field under validation must be yes, on, 1 or true. This is useful for validating "Terms of Service" acceptance.

#### after:date

The field under validation must be after the date in the named top-level input field.

#### after_or_equal:date

The field under validation must be after or equal to the date in the named top-level input field.

#### alpha

The field under validation must be entirely alphabetic characters.

#### alpha_dash

The field under validation may have alphanumeric characters, as well as dashes and underscores.

#### alpha_num

The field under validation must be entirely alphanumeric characters.

#### array

The field under validation must be an array.

#### before:date

The field under validation must be before the date in the named top-level input field.

#### before_or_equal:date

The field under validation must be before or equal to the date in the named top-level input field.

#### between:min,max

The field under validation must have a size between the given min and max. Strings, numbers, and arrays are evaluated in
the same fashion as the size rule.

#### boolean

The field under validation must be a boolean value of the form `true`, `false`, `0`, `1`, `'true'`, `'false'`, `'0'`
, `'1'`,

#### confirmed

The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is
password, a matching password_confirmation field must be present in the input.

#### date

The field under validation must be a valid date format which is acceptable by Javascript's `Date` object.

#### digits:value

The field under validation must be numeric and must have an exact length of value.

#### digits_between:min,max

The current implementation checks that the numeric value is between min and max;
it does not check digit count despite the rule's name and error message.

#### different:attribute

The given field must be different from the field under validation.

#### email

The field under validation must be formatted as an e-mail address.

#### hex

The field under validation should be a hexadecimal format. Useful in combination with other rules, like `hex|size:6` for
hex color code validation.

#### in:foo,bar,...

The field under validation must be included in the given list of values. The field can be an array or string.

#### integer

The field under validation must have an integer value.

#### max:value

Validate that an attribute is no greater than a given size

_Note: Maximum checks are inclusive._

#### Example 1 - Max validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const rules = {
  phone: 'required|digits:11|max:11',
}
const input = {
  phone: '01234567890',
}
new Validator(input, rules).passes() // => true
```

#### Example 2 - Max validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const rules = {
  phone: 'integer|max:16',
}
const input = {
  phone: '18',
}
new Validator(input, rules).passes() // => false
```

#### min:value

Validate that an attribute is at least a given size.

_Note: Minimum checks are inclusive._

#### Example 1 - Min validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const rules = {
  phone: 'required|digits:11|min:11',
}
const input = {
  phone: '01234567890',
}
new Validator(input, rules).passes() // => true
```

#### Example 2 - Min validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const rules = {
  phone: 'integer|min:11',
}
const input = {
  phone: '18',
}
new Validator(input, rules).passes() // => true
```

#### not_in:foo,bar,...

The field under validation must not be included in the given list of values.

#### numeric

Validate that an attribute is numeric. The string representation of a number will pass.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const rules = {
  amount: 'numeric|digits:5',
}
new Validator({ amount: '12345' }, rules).passes() // => true
```

#### present

The field under validation must have a value other than `undefined`, but can be empty.

#### required

Rejects `null` and `undefined`, then checks that the string representation contains
at least one non-whitespace character. Zero and false pass; empty arrays fail.

#### required_if:another_field,value

The field under validation must be nonempty if the other field strictly equals the supplied value.

#### required_unless:another_field,value

The field under validation must be nonempty unless the other field strictly equals the supplied value.

#### required_with:foo,bar,...

The field under validation must be present and not empty only if any of the other specified fields are present.

#### required_with_all:foo,bar,...

The field under validation must be present and not empty only if all the other specified fields are present.

#### required_without:foo,bar,...

The field under validation must be present and not empty only when any of the other specified fields are not present.

#### required_without_all:foo,bar,...

The field under validation must be present and not empty only when all the other specified fields are not present.

#### sometimes

In some situations, you may wish to run validation checks against a field only if that field is present in the data being validated. To quickly accomplish this, add the sometimes rule to your rule list:

```ts
import { Validator } from '@chantouchsek/validatorjs'

const rules = {
  email: 'sometimes|required|email',
}
new Validator({}, rules).passes() // => true
new Validator({ email: '' }, rules).passes() // => false
```

In the example above, the email field will only be validated if it is present in the input.

#### same:attribute

The given field must match the field under validation.

#### size:value

The field under validation must have a size matching the given value. For string data, value corresponds to the number
of characters. For numeric data, value corresponds to a given integer value.

#### string

The field under validation must be a string.

#### url

Validate that an attribute has a valid URL format

#### regex:pattern

The field under validation must match the given regular expression.

**Note**: When using the `regex` pattern, it may be necessary to specify rules in an array instead of using pipe
delimiters, especially if the regular expression contains a pipe character. For each backward slash that you used in
your regex pattern, you must escape each one with another backward slash.

#### Example 3 - Regex validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validation = new Validator(
  {
    name: 'Doe',
    salary: '10,000.00',
    yearOfBirth: '1980',
  },
  {
    name: 'required|size:3',
    salary: ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
    yearOfBirth: ['required', 'regex:/^(19|20)[\\d]{2,2}$/'],
  },
)

validation.fails() // => false
validation.passes() // => true
```

#### Example 4 - Type Checking Validation

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validation = new Validator(
  {
    age: 30,
    name: '',
  },
  {
    age: ['required', { in: [29, 30] }],
    name: [{ required_if: ['age', 30] }],
  },
)

validation.fails() // => true
validation.passes() // => false
```

### Register Custom Validation Rules

Use `Validator.register(name, callbackFn, errorMessage?)`.

**name** {String} - The name of the rule.

**callbackFn** {Function} - Returns a boolean to represent a successful or failed validation.

**errorMessage** {String} - An optional string where you can specify a custom error message. _:attribute_ inside
errorMessage will be replaced with the attribute name.

```ts
import { Validator } from '@chantouchsek/validatorjs'

Validator.register(
  'telephone',
  (value: unknown, _requirement: unknown, _attribute: string): boolean =>
    typeof value === 'string' && /^\d{3}-\d{3}-\d{4}$/.test(value),
  'The :attribute is not in the format XXX-XXX-XXXX.',
)

const validation = new Validator({ phone: '123-456-7890' }, { phone: 'required|telephone' })
validation.passes() // => true
const invalid = new Validator({ phone: '123' }, { phone: 'required|telephone' })
invalid.fails() // => true
invalid.errors.first('phone') // => 'The phone is not in the format XXX-XXX-XXXX.'
```

The callback receives `(value, requirement, attribute)`. A rule without a parameter
receives `undefined` as its requirement. Ordinary custom rules skip missing/empty
values; combine them with `required`, or use `registerImplicit` for a custom rule
that must run on empty input. Registrations are shared by all validator instances.

### Asynchronous Validation

Register an asynchronous rule which accepts a response callback as its fourth
argument. Call that callback exactly once, including on failures; returning a
Promise from the rule does not resolve validation automatically.

```ts
import { Validator } from '@chantouchsek/validatorjs'

type Respond = (passed?: boolean, message?: string) => void
Validator.registerAsync(
  'username_available',
  (username: string, _requirement: unknown, _attribute: string, respond: Respond): void => {
    setTimeout(() => {
      if (username === 'taken') respond(false, 'Username has already been taken.')
      else respond()
    }, 0)
  },
  'The :attribute is unavailable.',
)

const validator = new Validator(
  {
    username: 'taken',
  },
  {
    username: 'required|min:3|username_available',
  },
)

const passed = await validator.passesAsync()
passed // => false
validator.errors.first('username') // => 'Username has already been taken.'
```

This example uses top-level `await` in an ES module; it can also run inside an
`async` function. `passesAsync()` resolves `true` or `false` after validation finishes;
read `errors` and `errorCount` on the instance afterward. Errors thrown while
invoking validation, such as an unknown rule, reject the Promise instead of
resolving `false`. Exceptions thrown later in application-managed timers are not
automatically captured, and custom async rules must still call their response callback.

It also supports synchronous rules without a separate wrapper:

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validator = new Validator({ email: 'ada@example.com' }, { email: 'required|email' })
const passed: boolean = await validator.passesAsync()
passed // => true
validator.errors.all() // => {}
```

The callback APIs remain available: when async rules are present, `passes(callback)`
and `fails(callback)` require a callback. `checkAsync(onPass, onFail)` handles both
outcomes and returns `void`. Complete one validation run before starting another on
the same instance. A custom rule that never responds still leaves validation pending;
`passesAsync()` does not add a timeout or adopt returned Promises from custom rules.

### Working with validated input

Use `validated()` method to retrieve only the validated data and to filter out attributes not found on rules provided.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validation = new Validator(
  {
    age: 28,
    email: 'johndoe@gmail.com',
    gender: 'male',
    name: 'John',
  },
  {
    age: 'min:18',
    name: 'required',
  },
)
validation.validated() // => { name: 'John', age: 28 }
```

`validated()` method will throw an error when current validation is failing.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validation = new Validator(
  {
    age: 28,
    email: 'johndoe@gmail.com',
    gender: 'male',
    name: 'John',
  },
  {
    age: 'min:40',
    name: 'required',
  },
)
validation.validated() // throws: Validation failed!
```

`validated()` also works with asynchronous validation. Its first callback receives
the filtered data as its first argument; the second callback handles failure.

```ts
import { Validator } from '@chantouchsek/validatorjs'

type Respond = (passed?: boolean, message?: string) => void
Validator.registerAsync('allowed_name', (value: string, _requirement: unknown, _attribute: string, respond: Respond): void => {
  setTimeout(() => respond(value !== 'blocked'), 0)
}, 'The :attribute is blocked.')

const validation = new Validator(
  {
    age: 28,
    email: 'johndoe@gmail.com',
    gender: 'male',
    name: 'John',
  },
  {
    age: 'min:18',
    name: 'required|allowed_name',
  },
)
const data = await new Promise<Record<string, unknown>>((resolve, reject) => {
  validation.validated(
    (validated: Record<string, unknown>) => resolve(validated),
    () => reject(new Error('Validation failed')),
  )
})
data // => { name: 'John', age: 28 }
```

For nested data, place rules on the leaf fields you want returned:

```ts
import { Validator } from '@chantouchsek/validatorjs'

const input = {
  user: { name: 'Ada', secret: 'hidden' },
  items: [{ sku: 'A1', price: 10, internal: 'hidden' }],
  extra: 'hidden',
}
const rules = { 'user.name': 'required', 'items.*.sku': 'required', 'items.*.price': 'numeric' }
new Validator(input, rules).validated() // => { user: { name: 'Ada' }, items: [{ sku: 'A1', price: 10 }] }
```

`validated()` checks the input again and returns a JSON-cloned projection, without
type coercion or inferred output types. Use JSON-compatible input. Current limitations:
validating only an array parent can remove its elements, unruled objects can remain
as empty containers, and `null` as the entire input cannot be projected. Use leaf
rules for predictable filtering; this method is not a general-purpose sanitizer.

### Error Messages

This constructor will automatically generate error messages for validation rules that failed.

If there are errors, the Validator instance will have its **errors** property object populated with the error messages
for all failing attributes. The methods and properties on the **errors** property object are:

#### .first(attribute)

returns the first error message for an attribute, or `undefined` when none exists

#### .get(attribute)

returns an array of error messages for an attribute, or an empty array if there are no errors

#### .all()

returns an object containing all error messages for all failing attributes

#### .has(attribute)

returns true if error messages exist for an attribute, false otherwise

#### .errorCount

The number of failed rules on the validator instance (`validation.errorCount`),
not a property on `validation.errors`.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const input = { email: 'invalid' }
const rules = { email: 'required|email' }
const validation = new Validator(input, rules)
validation.fails()
validation.errors.first('email') // => 'The email format is invalid.'
validation.errors.get('email') // => ['The email format is invalid.']
```

### Custom Error Messages

Pass overrides in the third argument's `customMessages` property. Use the rule
name for all fields, or `rule.attribute` for a particular field.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const input = {
  name: '',
}

const rules = {
  name: 'required',
}

const validation = new Validator(input, rules, {
  customMessages: { required: 'You forgot to give a :attribute' },
})
validation.passes() // => false
validation.errors.first('name') // => 'You forgot to give a name'
```

Some validators have string and numeric versions. You can change them too.

```ts
import { Validator } from '@chantouchsek/validatorjs'

const input = {
  username: 'myusernameistoolong',
}

const rules = {
  username: 'max:16',
}

const validation = new Validator(input, rules, {
  customMessages: {
    max: {
      string: 'The :attribute is too long. Max length is :max.',
    },
  },
})
validation.passes() // => false
validation.errors.first('username') // => 'The username is too long. Max length is 16.'
```

You can even provide error messages on a per-attribute basis! Just set the message's key to 'validator.attribute'

```ts
import { Validator } from '@chantouchsek/validatorjs'

const input = { email: '', name: '' }
const rules = { email: 'required', name: 'required' }

const validation = new Validator(input, rules, {
  customMessages: { 'required.email': 'Without an :attribute we can\'t reach you!' },
})

validation.passes() // => false
validation.errors.first('name') // => 'The name field is required.'
validation.errors.first('email') // => 'Without an email we can\'t reach you!'
```

### Custom Attribute Names

#### Using config for custom attribute name

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validator = new Validator(
  { form: { name: null } },
  { form: { age: 'required', name: 'required' } },
  {
    customAttributes: { form: { name: 'Username' } },
    customMessages: {
      required: 'The :attribute must be filled.',
    },
  },
)
if (validator.fails())
  validator.errors.first('form.name') // => 'The Username must be filled.'
```

To display a custom "friendly" attribute name in error messages, use `.setAttributeNames()`

```ts
import { Validator } from '@chantouchsek/validatorjs'

const validator = new Validator({ name: '' }, { name: 'required' })
validator.setAttributeNames({ name: 'custom_name' })
if (validator.fails())
  validator.errors.first('name') // => 'The custom_name field is required.'
```

Alternatively you can supply global custom attribute names in your lang with the `attributes` property.

You can also configure a custom attribute formatter:

```ts
import { Validator } from '@chantouchsek/validatorjs'

// Configure global formatter.
Validator.setAttributeFormatter((attribute: string) => {
  return attribute.replace(/_/g, ' ')
})

// Or configure formatter for particular instance.
const validator = new Validator({ first_name: '' }, { first_name: 'required' })
validator.setAttributeFormatter((attribute: string) => {
  return attribute.replace(/_/g, ' ')
})
if (validator.fails())
  validator.errors.first('first_name') // => 'The first name field is required.'
```

Note: by default all \_ characters will be replaced with spaces.

### Language Support

Locales are bundled in the public package entry. Use named imports in Node or a
browser bundler; no separate `dist/lang/*.js` import is needed. English is the
initial default. `LangTypes` lists the supported locale codes.

```ts
import type { ValidatorOptions } from '@chantouchsek/validatorjs'
import { Validator } from '@chantouchsek/validatorjs'

const previousLocale = Validator.getDefaultLang()
const options: ValidatorOptions = { locale: 'fr', customAttributes: { name: 'Nom' } }
const validation = new Validator({ name: '' }, { name: 'required' }, options)
validation.fails() // => true
validation.errors.first('name') // => 'Le champ Nom est requis.'
Validator.useLang(previousLocale)
```

Currently, constructing a validator with `locale` also changes the global default
for later validators and custom-rule registrations. Set or restore the default
explicitly in shared applications. Use a supported locale; unknown codes have no
automatic fallback. To set a default for subsequent instances:

```ts
import { Validator } from '@chantouchsek/validatorjs'

const previousLocale = Validator.getDefaultLang()
Validator.useLang('km')
Validator.getDefaultLang() // => 'km'
const validation = new Validator({ name: '' }, { name: 'required' })
validation.fails() // => true
validation.errors.first('name') // => 'ឈ្មោះ ត្រូវតែបញ្ចូលជាដាច់ខាត។'
Validator.useLang(previousLocale)
```

`getMessages` returns a shared locale dictionary. Copy it before overriding messages
with `setMessages`; preserve the other templates so unrelated rules can still render:

```ts
import { Validator } from '@chantouchsek/validatorjs'

const original = Validator.getMessages('en')
Validator.setMessages('en', { ...original, required: 'Whoops, :attribute is required.' })
const validation = new Validator({}, { name: 'required' }, { locale: 'en' })
validation.fails() // => true
validation.errors.first('name') // => 'Whoops, name is required.'
Validator.setMessages('en', original)
```

If you don't see support for your language, please add one to `src/lang`!

### License

Copyright &copy; 2020-Present Chantouch Sek

Released under the MIT license

### Credits

ValidatorJs re-written by Chantouch Sek

E-Mail: [chantouchsek.cs83@gmail.com](mailto:chantouchsek.cs93@gmail.com)

Twitter [@DevidCs83](https://twitter.com/DevidCs83)

Website: [Chantouch](https://chantouch.me)
