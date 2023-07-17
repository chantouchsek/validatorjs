# ValidatorJs

[![ci](https://github.com/chantouchsek/validator-js/actions/workflows/ci.yml/badge.svg)](https://github.com/chantouchsek/validator-js/actions/workflows/ci.yml)
[![Latest Version on NPM](https://img.shields.io/npm/v/@chantouchsek/validatorjs.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/validatorjs)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/@chantouchsek/validatorjs.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/validatorjs)
[![npm](https://img.shields.io/npm/dm/@chantouchsek/validatorjs.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/validatorjs)

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

### Browser

```html
<script src="@chantouchsek/validatorjs.js"></script>
```

### Node.js / Browserify

```js
// ES5
const Validator = require('@chantouchsek/validatorjs')
```

```js
// ES6
import Validator from '@chantouchsek/validatorjs'
```

### Basic Usage

```js
const validation = new Validator(data, rules, options)
```

**data** {Object} - The data you want to validate

**rules** {Object} - Validation rules

**options** {Object} - Optional custom **options** to return

- Options
  - locale?: string | Optional passing locale from config
  - confirmedReverse?: boolean | Optional showing error message on confirmation field instead of password
  - customMessages?: Record<string, any> | Optional custom error messages to return
  - customAttributes?: Record<string, any> | Optional custom attribute name to return

#### Example 1 - Passing Validation

```js
const data = {
  name: 'John',
  email: 'johndoe@gmail.com',
  age: 28,
}

const rules = {
  name: 'required',
  email: 'required|email',
  age: 'min:18',
}

const validation = new Validator(data, rules)

validation.passes() // true
validation.fails() // false
```

To apply validation rules to the _data_ object, use the same object key names for the _rules_ object.

#### Example 2 - Failing Validation

```js
const validation = new Validator(
  {
    name: 'D',
    email: 'not an email address.com',
  },
  {
    name: 'size:3',
    email: 'required|email',
  },
)

validation.fails() // true
validation.passes() // false

// Error messages
validation.errors.first('email') // 'The email format is invalid.'
validation.errors.get('email') // returns an array of all email error messages
```

### Nested Rules

Nested objects can also be validated. There are two ways to declare validation rules for nested objects. The first way
is to declare the validation rules with a corresponding nested object structure that reflects the data. The second way
is to declare validation rules with flattened key names. For example, to validate the following data:

```js
const data = {
  name: 'John',
  bio: {
    age: 28,
    education: {
      primary: 'Elementary School',
      secondary: 'Secondary School',
    },
  },
}
```

We could declare our validation rules as follows:

```js
const nested = {
  name: 'required',
  bio: {
    age: 'min:18',
    education: {
      primary: 'string',
      secondary: 'string',
    },
  },
}

// OR

const flattened = {
  'name': 'required',
  'bio.age': 'min:18',
  'bio.education.primary': 'string',
  'bio.education.secondary': 'string',
}
```

### WildCards Rules

WildCards can also be validated.

```js
const data = {
  users: [
    {
      name: 'John',
      bio: {
        age: 28,
        education: {
          primary: 'Elementary School',
          secondary: 'Secondary School',
        },
      },
    },
  ],
}
```

We could declare our validation rules as follows:

```js
const rules = {
  'users.*.name': 'required',
  'users.*.bio.age': 'min:18',
  'users.*.bio.education.primary': 'string',
  'users.*.bio.education.secondary': 'string',
}
```

### Available Rules

Validation rules do not have an implicit 'required'. If a field is _undefined_ or an empty string, it will pass
validation. If you want a validation to fail for undefined or '', use the _required_ rule.

#### accepted

The field under validation must be yes, on, 1 or true. This is useful for validating "Terms of Service" acceptance.

#### after:date

The field under validation must be after the given date.

#### after_or_equal:date

The field under validation must be after or equal to the given field

#### alpha

The field under validation must be entirely alphabetic characters.

#### alpha_dash

The field under validation may have alphanumeric characters, as well as dashes and underscores.

#### alpha_num

The field under validation must be entirely alphanumeric characters.

#### array

The field under validation must be an array.

#### before:date

The field under validation must be before the given date.

#### before_or_equal:date

The field under validation must be before or equal to the given date.

#### between:min,max

The field under validation must have a size between the given min and max. Strings, numerics, and files are evaluated in
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

The field under validation must be numeric and must have length between given min and max.

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

```js
const rules = {
  phone: 'required|digits|max:11',
}
const input = {
  phone: '01234567890',
}
// passes: true
```

#### Example 2 - Max validation

```js
const rules = {
  phone: 'integer|max:16',
}
const input = {
  phone: '18',
}
// passes: false
```

#### min:value

Validate that an attribute is at least a given size.

_Note: Minimum checks are inclusive._

#### Example 1 - Min validation

```js
const rules = {
  phone: 'required|digits|min:11',
}
const input = {
  phone: '01234567890',
}
// passes: true
```

#### Example 2 - Min validation

```js
const rules = {
  phone: 'integer|min:11',
}
const input = {
  phone: '18',
}
// passes: false
```

#### not_in:foo,bar,...

The field under validation must not be included in the given list of values.

#### numeric

Validate that an attribute is numeric. The string representation of a number will pass.

```js
const rules = {
  amount: 'numeric|digits:5',
}
```

#### present

The field under validation must be present in the input data but can be empty.

#### required

Checks if the length of the String representation of the value is >

#### required_if:another_field,value

The field under validation must be present and not empty if the another field is equal to any value.

#### required_unless:another_field,value

The field under validation must be present and not empty unless the another field is equal to any value.

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

```js
const rules = {
  email: 'sometimes|required|email',
}
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

```js
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

validation.fails() // false
validation.passes() // true
```

#### Example 4 - Type Checking Validation

```js
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

validation.fails() // true
validation.passes() // false
```

### Register Custom Validation Rules

```js
Validator.register(name, callbackFn, errorMessage)
```

**name** {String} - The name of the rule.

**callbackFn** {Function} - Returns a boolean to represent a successful or failed validation.

**errorMessage** {String} - An optional string where you can specify a custom error message. _:attribute_ inside
errorMessage will be replaced with the attribute name.

```js
Validator.register(
  'telephone',
  (value, requirement, attribute) => {
    // requirement parameter defaults to null
    return value.match(/^\d{3}-\d{3}-\d{4}$/)
  },
  'The :attribute phone number is not in the format XXX-XXX-XXXX.',
)
```

### Asynchronous Validation

Register an asynchronous rule which accepts a `passes` callback:

```js
Validator.registerAsync('username_available', (username, attribute, req, passes) => {
  // do your database/api checks here etc
  // then call the `passes` method where appropriate:
  passes() // if username is available
  passes(false, 'Username has already been taken.') // if username is not available
})
```

Then call your validator using `checkAsync` passing `fails` and `passes` callbacks like so:

```js
const validator = new Validator(
  {
    username: 'test123',
  },
  {
    username: 'required|min:3|username_available',
  },
)

function passes() {
  // Validation passed
}

function fails() {
  validator.errors.first('username')
}

validator.checkAsync(passes, fails)
```

### Working with validated input

Use `validated()` method to retrieve only the validated data and to filter out attributes not found on rules provided.

```js
const validation = new Validator(
  {
    name: 'John',
    email: 'johndoe@gmail.com',
    age: 28,
    gender: 'male',
  },
  {
    name: 'required',
    age: 'min:18',
  },
)
validation.validated() // will return `{ "name": "John", "age": 28 }`
```

`validated()` method will throw an error when current validation is failing.

```js
const validation = new Validator(
  {
    name: 'John',
    email: 'johndoe@gmail.com',
    age: 28,
    gender: 'male',
  },
  {
    name: 'required',
    age: 'min:40',
  },
)
validation.validated() // will throw `Error('Validation failed!')`
```

`validated()` method also works with asynchronous validation. In this case,
`passes()` callback will receive only the validated data (without the
attributes not found on rules provided) as the first argument.

```js
const validation = new Validator(
  {
    name: 'John',
    email: 'johndoe@gmail.com',
    age: 28,
    gender: 'male',
  },
  {
    name: 'required|some_async_rule',
    age: 'min:18',
  },
)
function passes(validated) {
  console.log(validated) // will output `{ "name": "John", "age": 28 }` if `some_async_rule` validates `'John'`
}
function fails() {
  // will be called if `some_async_rule` does not validate `'John'`
}
validation.validated(passes, fails)
```

### Error Messages

This constructor will automatically generate error messages for validation rules that failed.

If there are errors, the Validator instance will have its **errors** property object populated with the error messages
for all failing attributes. The methods and properties on the **errors** property object are:

#### .first(attribute)

returns the first error message for an attribute, false otherwise

#### .get(attribute)

returns an array of error messages for an attribute, or an empty array if there are no errors

#### .all()

returns an object containing all error messages for all failing attributes

#### .has(attribute)

returns true if error messages exist for an attribute, false otherwise

#### .errorCount

the number of validation errors

```js
const validation = new Validator(input, rules)
validation.errors.first('email') // returns first error message for email attribute
validator.errors.get('email') // returns an array of error messages for the email attribute
```

### Custom Error Messages

If you need a specific error message, and you don't want to override the default one, you can pass an override as the
third argument to the Validator object, just like
with [Laravel](http://laravel.com/docs/validation#custom-error-messages).

```js
const input = {
  name: '',
}

const rules = {
  name: 'required',
}

const validation = new Validator(input, rules, {
  required: 'You forgot to give a :attribute',
})
validation.passes()
validation.errors.first('name') // returns 'You forgot to give a name'
```

Some validators have string and numeric versions. You can change them too.

```js
const input = {
  username: 'myusernameistoolong',
}

const rules = {
  username: 'max:16',
}

const validation = new Validator(input, rules, {
  max: {
    string: 'The :attribute is too long. Max length is :max.',
  },
})
validation.passes()
validation.errors.first('username') // returns 'The username is too long. Max length is 16.'
```

You can even provide error messages on a per-attribute basis! Just set the message's key to 'validator.attribute'

```js
const input = { name: '', email: '' }
const rules = { name: 'required', email: 'required' }

const validation = new Validator(input, rules, {
  'required.email': 'Without an :attribute we can\'t reach you!',
})

validation.passes()
validation.errors.first('name') // returns  'The name field is required.'
validation.errors.first('email') // returns 'Without an email we can\'t reach you!'
```

### Custom Attribute Names

#### Using config for custom attribute name

```js
const validator = new Validator(
  { form: { name: null } },
  { form: { name: 'required', age: 'required' } },
  {
    customAttributes: { form: { name: 'Username' } },
    customMessages: {
      required: 'The :attribute need to be filled.',
    },
  },
)
if (validator.fails())
  validator.errors.first('form.name') // "The Userame need to be filled."
```

To display a custom "friendly" attribute name in error messages, use `.setAttributeNames()`

```js
const validator = new Validator({ name: '' }, { name: 'required' })
validator.setAttributeNames({ name: 'custom_name' })
if (validator.fails())
  validator.errors.first('name') // "The custom_name field is required."
```

Alternatively you can supply global custom attribute names in your lang with the `attributes` property.

You can also configure a custom attribute formatter:

```js
// Configure global formatter.
Validator.setAttributeFormatter((attribute) => {
  return attribute.replace(/_/g, ' ')
})

// Or configure formatter for particular instance.
const validator = new Validator({ first_name: '' }, { first_name: 'required' })
validator.setAttributeFormatter((attribute) => {
  return attribute.replace(/_/g, ' ')
})
if (validator.fails())
  console.log(validator.errors.first('first_name')) // The first name field is required.
```

Note: by default all \_ characters will be replaced with spaces.

### Language Support

Error messages are in English by default. To include another language in the browser, reference the language file in a
script tag and call `Validator.useLang('lang_code')`.

```html
<script src="dist/main.js"></script>
<script src="dist/lang/km.js"></script>
<script>
  Validator.useLang('km')
</script>
```

In Node, it will automatically pick up on the language source files.

```js
const Validator = require('validatorjs')

Validator.useLang('km')
```

If you don't see support for your language, please add one to `src/lang`!

You can also add your own custom language by calling `setMessages`:

```js
Validator.setMessages('lang_code', {
  required: 'The :attribute field is required.',
})
```

Get the raw object of messages for the given language:

```js
Validator.getMessages('lang_code')
```

Switch the default language used by the validator:

```js
Validator.useLang('lang_code')
```

Get the default language being used:

```js
Validator.getDefaultLang() // returns e.g. 'en'
```

Override default messages for language:

```js
const messages = Validator.getMessages('en')
messages.required = 'Whoops, :attribute field is required.'
Validator.setMessages('en', messages)
```

### License

Copyright &copy; 2020-Present Chantouch Sek

Released under the MIT license

### Credits

ValidatorJs re-written by Chantouch Sek

E-Mail: [chantouchsek.cs83@gmail.com](mailto:chantouchsek.cs93@gmail.com)

Twitter [@DevidCs83](https://twitter.com/DevidCs83)

Website: [Chantouch](https://chantouch.me)
