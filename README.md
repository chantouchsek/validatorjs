# vue-vlidator

The vue-vlidator library makes data validation in JavaScript very easy in both the browser and Node.js.
This library was inspired by the [Laravel framework's Validator](http://laravel.com/docs/validation) and 
[ValidatorJs](https://github.com/skaterdav85/validatorjs)

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-vlidator.svg?style=flat-square)](https://npmjs.com/package/vue-vlidator)
  [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
  [![npm](https://img.shields.io/npm/dt/vue-vlidator.svg?style=flat-square)](https://npmjs.com/package/vue-vlidator)
  [![npm](https://img.shields.io/npm/dm/vue-vlidator.svg?style=flat-square)](https://npmjs.com/package/vue-vlidator)

## Why use vue-vlidator?

* Not dependent on any libraries.
* Works in both the browser and Node.
* Readable and declarative validation rules.
* Error messages with multilingual support.

## Installation

### Using npm

```npm
npm install vue-vlidator
```

### Using yarn

```yarn
yarn add vue-vlidator
```

### Browser

```html
<script src="vue-vlidator.js"></script>
```

### Node.js / Browserify

```js
// ES5
let Validator = require('vue-vlidator');
```

```js
// ES6
import Validator from 'vue-vlidator';
```

### Basic Usage

```js
let options = {
  input: {},
  rules: {},
  locale: 'km',
  customMessages: {},
  customAttributes: {}
}
let validation = new Validator(options);
```

__data__ {Object} - The data you want to validate

__rules__ {Object} - Validation rules

__locale__ {string} - Validation locale

__customMessages__ {Object} - Optional custom error messages to return

__customAttributes__ {Object} - Optional custom error attributes to return

## Nuxt Support

Put it on top of `nuxt-i18n`

``nuxt.config.js``
```js
  export default {
    modules: [
        'vue-vlidator/nuxt',
        'nuxt-i18n',
      ],
    vlidator: {}
  }
```

### Vue plugins

```js
import Vue from 'vue';
import Validator from 'vue-vlidator';

const options = { locale: 'km', customAttributes: {}, customMessages: {}, langDir: 'lang/' }

Vue.use(Validator, options);
```

#### Available options
1. locale {string}
2. customMessages {Object}

#### Example in Vue component
```vue
<template>
    <b-form @submit.prevent="onSubmit">
        <b-form-group
                id="fieldset-1"
                description="Let us know your name."
                label="Enter your name"
                label-for="input-1"
                :state="$vlidator.errors.has('form.name')"
                :invalid-feedback="$vlidator.errors.first('form.name')"
        >
            <b-form-input
                    id="input-1"
                    v-model="form.name"
                    :state="!$vlidator.errors.has('form.name')"
                    trim
            />
        </b-form-group>
        <b-form-group
                id="fieldset-2"
                description="Let us know your email."
                label="Enter your email"
                label-for="input-2"
                :state="$vlidator.errors.has('form.email')"
                :invalid-feedback="$vlidator.errors.first('form.email')"
        >
            <b-form-input
                    id="input-2"
                    v-model="form.email"
                    :state="!$vlidator.errors.has('form.email')"
                    type="email"
                    trim
            />
        </b-form-group>
        <b-form-group
                id="fieldset-3"
                description="Let us know your age."
                label="Enter your age"
                label-for="input-3"
                :state="$vlidator.errors.has('form.age')"
                :invalid-feedback="$vlidator.errors.first('form.age')"
        >
            <b-form-input
                    id="input-3"
                    v-model.number="form.age"
                    :state="!$vlidator.errors.has('form.age')"
                    type="number"
                    trim
            />
        </b-form-group>
        <b-button type="submit" variant="primary" :disabled="$vlidator.errors.any()">
            Submit
        </b-button>
    </b-form>
</template>

<script>
  export default {
    name: "HomePage",
    data () {
      return {
        form: {
          name: 'John',
          email: 'johndoe@gmail.com',
          age: 18
        }
      }
    },
    vlidator: {
      rules: {
        form: {
          name: 'required|min:4',
          email: 'required|email',
          age: 'required|numeric|min:18|max:50'
        }
      }
    },
    methods: {
      async onSubmit () {
          try {
            const { data } = await this.validate()
            console.log(data)
            alert(JSON.stringify(this.form))
          } catch (e) {
            console.log(e)
          }
      }
    },
  }
</script>
```

---

## Example for NodeJs

#### Example 1 - Passing Validation

```js
import Validator from 'vue-vlidator'

let input = {
  name: 'John',
  email: 'johndoe@gmail.com',
  age: 28
};

let rules = {
  name: 'required',
  email: 'required|email',
  age: 'min:18'
};

let validation = new Validator({ input, rules, customMessages: {}, customAttributes: {} });

validation.passes(); // true
validation.fails(); // false
```

To apply validation rules to the _data_ object, use the same object key names for the _rules_ object.

#### Example 2 - Failing Validation

```js
let validation = new Validator({
  input: {
    name: 'D',
    email: 'not an email address.com'
  },
  rules: {
    name: 'size:3',
    email: 'required|email'
  }
});

validation.fails(); // true
validation.passes(); // false

// Error messages
validation.errors.first('email'); // 'The email format is invalid.'
validation.errors.get('email'); // returns an array of all email error messages
```

### Nested Rules

Nested objects can also be validated. There are two ways to declare validation rules for nested objects. The first way is to declare the validation rules with a corresponding nested object structure that reflects the data. The second way is to declare validation rules with flattened key names. For example, to validate the following data:

```js
let input = {
  name: 'John',
  bio: {
    age: 28,
    education: {
      primary: 'Elementary School',
      secondary: 'Secondary School'
    }
  }
};
```

We could declare our validation rules as follows:

```js
let nested = {
  name: 'required',
  bio: {
    age: 'min:18',
    education: {
      primary: 'string',
      secondary: 'string'
    }
  }
};

// OR

let flattened = {
  'name': 'required',
  'bio.age': 'min:18',
  'bio.education.primary': 'string',
  'bio.education.secondary': 'string'
};
```

### WildCards Rules

WildCards can also be validated.

```js
let data = {
  users: [{
    name: 'John',
    bio: {
      age: 28,
      education: {
        primary: 'Elementary School',
        secondary: 'Secondary School'
      }
    }
  }]
};
```

We could declare our validation rules as follows:

```js
let rules = {
  'users.*.name': 'required',
  'users.*.bio.age': 'min:18',
  'users.*.bio.education.primary': 'string',
  'users.*.bio.education.secondary': 'string'
};
```

### Available Rules

Validation rules do not have an implicit 'required'. If a field is _undefined_ or an empty string, it will pass validation. If you want a validation to fail for undefined or '', use the _required_ rule.

#### accepted

The field under validation must be yes, on, 1 or true. This is useful for validating "Terms of Service" acceptance.

#### after:date

The field under validation must be after the given date.

#### after_or_equal:date

The field under validation must be after or equal to the given field

#### alpha

The field under validation must be entirely alphabetic characters.

#### alpha_dash

The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### alpha_num

The field under validation must be entirely alpha-numeric characters.

#### array

The field under validation must be an array.

#### before:date

The field under validation must be before the given date.


#### before_or_equal:date

The field under validation must be before or equal to the given date.

#### between:min,max

The field under validation must have a size between the given min and max. Strings, numeric, and files are evaluated in the same fashion as the size rule.

#### boolean

The field under validation must be a boolean value of the form `true`, `false`, `0`, `1`, `'true'`, `'false'`, `'0'`, `'1'`,

#### confirmed

The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is password, a matching password_confirmation | passwordConfirmation field must be present in the input.
- if you want to show reverse message on `_confirmation` attribute, you need to provide an option called `confirmedReverse`

#### date

The field under validation must be a valid date format which is acceptable by Javascript's `Date` object.

#### digits:value

The field under validation must be numeric and must have an exact length of value.

#### digits_between:min,max

The field under validation must be numeric and must have length between given min and max.

#### different:attribute

The given field must be different than the field under validation.

#### email

The field under validation must be formatted as an e-mail address.

#### hex
The field under validation should be a hexadecimal format. Useful in combination with other rules, like `hex|size:6` for hex color code validation.

#### gt:field
The field under validation must be greater than the given field. The two fields must be of the same type.

#### gte:field
The field under validation must be greater than or equal to the given field. The two fields must be of the same type.

#### in:foo,bar,...

The field under validation must be included in the given list of values. The field can be an array or string.

#### integer

The field under validation must have an integer value.

#### lt:field
The field under validation must be less than the given field. The two fields must be of the same type.


#### lte:field
The field under validation must be less than or equal to the given field. The two fields must be of the same type.

#### max:value
Validate that an attribute is no greater than a given size

_Note: Maximum checks are inclusive._

#### min:value

Validate that an attribute is at least a given size.

_Note: Minimum checks are inclusive._

#### not_in:foo,bar,...

The field under validation must not be included in the given list of values.

#### numeric

Validate that an attribute is numeric. The string representation of a number will pass.

#### present
The field under validation must be present in the input data but can be empty.

#### required

Checks if the length of the String representation of the value is >

#### required_if:anotherfield,value

The field under validation must be present and not empty if the anotherfield field is equal to any value.

#### required_unless:anotherfield,value

The field under validation must be present and not empty unless the anotherfield field is equal to any value.

#### required_with:foo,bar,...

The field under validation must be present and not empty only if any of the other specified fields are present.

#### required_with_all:foo,bar,...

The field under validation must be present and not empty only if all of the other specified fields are present.

#### required_without:foo,bar,...

The field under validation must be present and not empty only when any of the other specified fields are not present.

#### required_without_all:foo,bar,...

The field under validation must be present and not empty only when all of the other specified fields are not present.

#### same:attribute

The given field must match the field under validation.

#### size:value

The field under validation must have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value.

#### string

The field under validation must be a string.

#### url

Validate that an attribute has a valid URL format

#### regex:pattern

The field under validation must match the given regular expression.

#### password

The field under must be meet the password.

**Note**: When using the ``regex`` pattern, it may be necessary to specify rules in an array instead of using pipe delimiters, especially if the regular expression contains a pipe character.
For each backward slash that you used in your regex pattern, you must escape each one with another backward slash
. Note that vlidator uses the standard JavaScript [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) flavor of regular expressions.

#### Example 3 - Regex validation

```js
let validation = new Validator({
  input: {
    name: 'Doe',
    salary: '10,000.00',
    yearOfBirth: '1980'
  },
  rules: {
    name: 'required|size:3',
    salary: ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
    yearOfBirth: ['required', 'regex:/^(19|20)[\\d]{2,2}$/']
  }
});

validation.fails(); // false
validation.passes(); // true

```

#### Example 4 - Type Checking Validation

```js
let validation = new Validator({
  input: {
    age: 30,
    name: ''
  },
  rules: {
    age: ['required', { 'in': [29, 30] }],
    name: [{ required_if: ['age', 30] }]
  }
});

validation.fails(); // true
validation.passes(); // false

```

### Register Custom Validation Rules

```js
Validator.register(name, callbackFn, errorMessage);
```

__name__ {String} - The name of the rule.

__callbackFn__ {Function} - Returns a boolean to represent a successful or failed validation.

__errorMessage__ {String} - An optional string where you can specify a custom error message. _:attribute_ inside errorMessage will be replaced with the attribute name.

```js
Validator.register('telephone', function(value, requirement, attribute) { // requirement parameter defaults to null
  return value.match(/^\d{3}-\d{3}-\d{4}$/);
}, 'The :attribute phone number is not in the format XXX-XXX-XXXX.');
```

### Asynchronous Validation

Register an asynchronous rule which accepts a `passes` callback:

```js
Validator.registerAsync('username_available', function(username, attribute, req, passes) {
  // do your database/api checks here etc
  // then call the `passes` method where appropriate:
  passes(); // if username is available
  passes(false, 'Username has already been taken.'); // if username is not available
});
```

Then call your validator using `checkAsync` passing `fails` and `passes` callbacks like so:

```js
let validator = new Validator({
	input: {
	  username: 'test123'
    },
    rules: {
      username: 'required|min:3|username_available'
    }
});

function passes() {
  // Validation passed
}

function fails() {
  validator.errors.first('username');
}

validator.checkAsync(passes, fails);

```

### Error Messages

This constructor will automatically generate error messages for validation rules that failed.

If there are errors, the Validator instance will have its __errors__ property object populated with the error messages for all failing attributes. The methods and properties on the __errors__ property object are:

#### .first(attribute)

returns the first error message for an attribute, false otherwise

#### .get(attribute)

returns an array of error messages for an attribute, or an empty array if there are no errors

#### .all()

returns an object containing all error messages for all failing attributes

#### .has(attribute)

returns true if error messages exist for an attribute, undefined otherwise

#### .errorCount

the number of validation errors

#### .any()

return true if there is any errors exist

#### .fill(errors = {})

fill the errors object, use for custom fill errors

#### .flush()

to clear all errors

#### .clear(attribute)

to clear the given attribute from errors

#### .keydown(event)

to clear the input target.name give provide in form
- Example: `<input type='text' name='name' v-model='name' />`

```js
let validation = new Validator({input, rules});
validation.errors.first('email'); // returns first error message for email attribute
validator.errors.get('email'); // returns an array of error messages for the email attribute
```

### Custom Error Messages

If you need a specific error message and you don't want to override the default one, you can pass an override as the third argument to the Validator object, just like with [Laravel](http://laravel.com/docs/validation#custom-error-messages).

```js
let input = {
  name: ''
};

let rules = {
  name : 'required'
};

let options = {
  input,
  rules,
  customMessages: {
    required: 'You forgot to give a :attribute'
  }
}

let validation = new Validator(options);
validation.errors.first('name'); // returns 'You forgot to give a name'
```

Some of the validators have string and numeric versions. You can change them too.

```js
let input = {
  username: 'myusernameistoolong'
};

let rules = {
  username : 'max:16'
};

let options = {
  input,
  rules,
  customMessages: {
    max: {
      string: 'The :attribute is too long. Max length is :max.'
    }
  }
}

let validation = new Validator(options);

validation.errors.first('username'); // returns 'The username is too long. Max length is 16.'
```

You can even provide error messages on a per attribute basis! Just set the message's key to 'validator.attribute'

Attributes can be like below:

```js
module.exports = {
    regex: 'The :attribute format is invalid.',
    attributes: {
      'form.age': 'អាយុ',
      name: 'ឈ្មោះ',
      form: {
        name: 'ឈ្មោះ',
        gender: 'Sex'
      }
    }
}
```

```js
let input = { name: '', email: '' };
let rules = { name : 'required', email : 'required' };
let customMessages = {
  "required.email": "Without an :attribute we can't reach you!"
}
let options = {
  input,
  rules,
  customMessages
}

let validation = new Validator(options);

validation.errors.first('name'); // returns  'The name field is required.'
validation.errors.first('email'); // returns 'Without an email we can\'t reach you!'
```

### Custom Attribute Names

To display a custom "friendly" attribute name in error messages, use `.setAttributeNames()`

```js
let validator = new Validator({
  input: { name: '' },
  rules: { name: 'required' }
});
validator.setAttributeNames({ name: 'custom_name' });
if (validator.fails()) {
  validator.errors.first('name'); // "The custom_name field is required."
}
```

Alternatively you can supply global custom attribute names in your lang with the `attributes` property.

You can also configure a custom attribute formatter:

```js
// Configure global formatter.
Validator.setAttributeFormatter(function(attribute) {
  return attribute.replace(/_/g, ' ');
});

// Or configure formatter for particular instance.
let validator = new Validator({
  input: { first_name: '' },
  rules: { first_name: 'required' }
});
validator.setAttributeFormatter(function(attribute) {
  return attribute.replace(/_/g, ' ');
});
if (validator.fails()) {
  console.log(validator.errors.first('first_name')); // The first name field is required.
}
```

Note: by default all _ characters will be replaced with spaces.

### Language Support

Error messages are in English by default. To include another language in the browser, reference the language file in a script tag and call `Validator.useLang('lang_code')`.

```html
<script src="dist/vue-vlidator.js"></script>
<script src="dist/lang/ru.js"></script>
<script>
  Validator.useLang('es');
</script>
```

In Node, it will automatically pickup on the language source files.

```js
let Validator = require('vue-vlidator');
Validator.useLang('ru');
```

If you don't see support for your language, please add one to `src/lang`!

You can also add your own custom language by calling `setMessages`:

```js
Validator.setMessages('lang_code', {
  required: 'The :attribute field is required.'
});
```

Get the raw object of messages for the given language:

```js
Validator.getMessages('lang_code');
```

Switch the default language used by the validator:

```js
Validator.useLang('lang_code');
```

Get the default language being used:

```js
Validator.getDefaultLang(); // returns e.g. 'en'
```

Override default messages for language:

```js
let messages = Validator.getMessages('en');
messages.required = 'Whoops, :attribute field is required.';
Validator.setMessages('en', messages);
```

### License

Copyright &copy; 2020 Chantouch Sek

Released under the MIT license

### Credits

vue-vlidator re-write by Chantouch Sek

E-Mail: [chantouchsek.cs83@gmail.com](mailto:chantouchsek.cs93@gmail.com)

Twitter [@DevidCs83](https://twitter.com/DevidCs83)

Website: [bookingkh.com](https://bookingkh.com)
