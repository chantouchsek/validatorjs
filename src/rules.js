import { parseISO, isValid } from 'date-fns';
import {
  isNaN,
  isString,
  isNumber,
  isFunction,
  isUndefined,
  isBoolean
} from 'lodash';

const leapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
const isValidDate = (inDate) => {
  if (inDate instanceof Date) {
    return !isNaN(inDate);
  }
  // reformat if supplied as mm.dd.yyyy (period delimiter)
  if (isString(inDate)) {
    const pos = inDate.indexOf('.');
    if (pos > 0 && pos <= 6) {
      inDate = inDate.replace(/\./g, '-');
    }
    if (inDate.length === 10) {
      return isValid(parseISO(inDate));
    }
  }
  const testDate = new Date(inDate);
  const yr = testDate.getFullYear();
  const mo = testDate.getMonth();
  const day = testDate.getDate();
  const daysInMonth = [
    31,
    leapYear(yr) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  if (yr < 1000) {
    return false;
  }
  if (isNaN(mo)) {
    return false;
  }
  if (mo + 1 > 12) {
    return false;
  }
  if (isNaN(day)) {
    return false;
  }
  return day <= daysInMonth[mo];
};

const rules = {
  required(val) {
    if (val === undefined || val === null) {
      return false;
    }
    const str = String(val).replace(/\s/g, '');
    return str.length > 0;
  },
  required_if(val, req, attribute) {
    req = this.getParameters();
    if (this.validator._objectPath(this.validator.input, req[0]) === req[1]) {
      return this.validator.getRule('required').validate(val);
    }
    return true;
  },
  required_unless(val, req, attribute) {
    req = this.getParameters();
    if (this.validator._objectPath(this.validator.input, req[0]) !== req[1]) {
      return this.validator.getRule('required').validate(val);
    }
    return true;
  },
  required_with(val, req, attribute) {
    if (this.validator._objectPath(this.validator.input, req)) {
      return this.validator.getRule('required').validate(val);
    }
    return true;
  },
  required_with_all(val, req, attribute) {
    req = this.getParameters();
    for (let i = 0; i < req.length; i++) {
      if (!this.validator._objectPath(this.validator.input, req[i])) {
        return true;
      }
    }
    return this.validator.getRule('required').validate(val);
  },
  required_without(val, req, attribute) {
    if (this.validator._objectPath(this.validator.input, req)) {
      return true;
    }
    return this.validator.getRule('required').validate(val);
  },
  required_without_all(val, req, attribute) {
    req = this.getParameters();
    for (let i = 0; i < req.length; i++) {
      if (this.validator._objectPath(this.validator.input, req[i])) {
        return true;
      }
    }
    return this.validator.getRule('required').validate(val);
  },
  boolean(val) {
    return (
      val === true ||
      val === false ||
      val === 0 ||
      val === 1 ||
      val === '0' ||
      val === '1' ||
      val === 'true' ||
      val === 'false'
    );
  },
  // compares the size of strings
  // with numbers, compares the value
  size(val, req, attribute) {
    if (val) {
      req = parseFloat(req);
      const size = this.getSize();
      return size === req;
    }
    return true;
  },
  string(val, req, attribute) {
    return isString(val);
  },
  sometimes(val) {
    return true;
  },
  /**
   * Compares the size of strings or the value of numbers if there is a truthy value
   */
  min(val, req, attribute) {
    const size = this.getSize();
    return size >= req;
  },
  /**
   * Compares the size of strings or the value of numbers if there is a truthy value
   */
  max(val, req, attribute) {
    const size = this.getSize();
    return size <= req;
  },
  between(val, req, attribute) {
    req = this.getParameters();
    const size = this.getSize();
    const min = parseFloat(req[0], 10);
    const max = parseFloat(req[1], 10);
    return size >= min && size <= max;
  },
  email(val) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  },
  numeric(val) {
    const num = Number(val); // tries to convert value to a number. useful if value is coming from form element
    return isNumber(num) && !isNaN(num) && !isBoolean(isBoolean);
  },
  array(val) {
    return Array.isArray(val);
  },
  url(url) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/i.test(
      url
    );
  },
  alpha(val) {
    return /^[a-zA-Z]+$/.test(val);
  },
  alpha_dash(val) {
    return /^[a-zA-Z0-9_\-]+$/.test(val);
  },
  alpha_num(val) {
    return /^[a-zA-Z0-9]+$/.test(val);
  },
  same(val, req) {
    const val1 = this.validator._flattenObject(this.validator.input)[req];
    return val1 === val;
  },
  different(val, req) {
    const val1 = this.validator._flattenObject(this.validator.input)[req];
    return val1 !== val;
  },
  in(val, req) {
    let list, i;
    if (val) {
      list = this.getParameters();
    }
    if (val && !Array.isArray(val)) {
      let localValue = val;
      for (i = 0; i < list.length; i++) {
        if (isString(list[i])) {
          localValue = String(val);
        }
        if (localValue === list[i]) {
          return true;
        }
      }
      return false;
    }
    if (val && Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        if (!list.includes(val[i])) {
          return false;
        }
      }
    }
    return true;
  },
  not_in(val, req) {
    const list = this.getParameters();
    const len = list.length;
    let returnVal = true;
    for (let i = 0; i < len; i++) {
      let localValue = val;
      if (isString(list[i])) {
        localValue = String(val);
      }
      if (localValue === list[i]) {
        returnVal = false;
        break;
      }
    }
    return returnVal;
  },
  accepted(val) {
    return (
      val === 'on' || val === 'yes' || val === 1 || val === '1' || val === true
    );
  },
  confirmed(val, req, key) {
    const confirmationKey = `${key}_confirmation`;
    const confirmedKey = `${key}Confirmation`;
    const val1 = this.validator._flattenObject(this.validator.input);
    if (val1.hasOwnProperty(confirmationKey)) {
      return val1[confirmationKey] === val;
    }
    return val1[confirmedKey] === val;
  },
  integer(val) {
    return String(parseInt(val, 10)) === String(val);
  },
  digits(val, req) {
    const numericRule = this.validator.getRule('numeric');
    return numericRule.validate(val) && String(val).length === parseInt(req);
  },
  digits_between(val) {
    const numericRule = this.validator.getRule('numeric');
    const req = this.getParameters();
    const valueDigitsCount = String(val).length;
    const min = parseFloat(req[0], 10);
    const max = parseFloat(req[1], 10);
    return (
      numericRule.validate(val) &&
      valueDigitsCount >= min &&
      valueDigitsCount <= max
    );
  },
  regex(val, req) {
    const mod = /[g|i|m]{1,3}$/;
    let flag = req.match(mod);
    flag = flag ? flag[0] : '';
    req = req.replace(mod, '').slice(1, -1);
    req = new RegExp(req, flag);
    return !!req.test(val);
  },
  date(val, format) {
    return isValidDate(val);
  },
  present(val) {
    return !isUndefined(val);
  },
  gt(val, req)  {
    const val1 = Number(this.validator._objectPath(this.validator.input, req));
    const val2 = Number(val);

    return isNaN(val1) || isNaN(val2) || val2 > val1;
  },
  lt(val, req)  {
    const val1 = Number(this.validator._objectPath(this.validator.input, req));
    const val2 = Number(val);

    return isNaN(val1) || isNaN(val2) || val2 < val1;
  },
  gte(val, req)  {
    const val1 = Number(this.validator._objectPath(this.validator.input, req));
    const val2 = Number(val);

    return isNaN(val1) || isNaN(val2) || val2 >= val1;
  },
  lte(val, req)  {
    const val1 = Number(this.validator._objectPath(this.validator.input, req));
    const val2 = Number(val);

    return isNaN(val1) || isNaN(val2) || val2 <= val1;
  },
  after(val, req) {
    const val1 = this.validator._objectPath(this.validator.input, req);
    const val2 = val;
    if (!isValidDate(val1)) {
      return false;
    }
    if (!isValidDate(val2)) {
      return false;
    }
    return new Date(val1).getTime() < new Date(val2).getTime();
  },
  after_or_equal(val, req) {
    const val1 = this.validator._objectPath(this.validator.input, req);
    const val2 = val;
    if (!isValidDate(val1)) {
      return false;
    }
    if (!isValidDate(val2)) {
      return false;
    }
    return new Date(val1).getTime() <= new Date(val2).getTime();
  },
  before(val, req) {
    const val1 = this.validator._objectPath(this.validator.input, req);
    const val2 = val;
    if (!isValidDate(val1)) {
      return false;
    }
    if (!isValidDate(val2)) {
      return false;
    }
    return new Date(val1).getTime() > new Date(val2).getTime();
  },
  before_or_equal(val, req) {
    const val1 = this.validator._objectPath(this.validator.input, req);
    const val2 = val;
    if (!isValidDate(val1)) {
      return false;
    }
    if (!isValidDate(val2)) {
      return false;
    }
    return new Date(val1).getTime() >= new Date(val2).getTime();
  },
  hex(val) {
    return /^[0-9a-f]+$/i.test(val);
  },
  password(val) {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(val);
  }
};
let missedRuleValidator = (name = null) => {
  throw new Error('Validator `' + name + '` is not defined!');
};
let missedRuleMessage;

class Rules {
  constructor(name, fn, async) {
    this.name = name;
    this.fn = fn;
    this.passes = null;
    this._customMessage = undefined;
    this.async = async;
  }

  /**
   * Validate rule
   *
   * @param  {any|void} inputValue
   * @param  {any|string} ruleValue
   * @param  {string} attribute
   * @param  {function} callback
   * @return {void|boolean}
   */
  validate(inputValue, ruleValue = '', attribute = '', callback = null) {
    const _this = this;
    this._setValidatingData(attribute, inputValue, ruleValue);
    if (isFunction(callback)) {
      this.callback = callback;
      const handleResponse = (passes, message) => {
        _this.response(passes, message);
      };
      if (this.async) {
        return this._apply(inputValue, ruleValue, attribute, handleResponse);
      } else {
        return handleResponse(this._apply(inputValue, ruleValue, attribute));
      }
    }
    return this._apply(inputValue, ruleValue, attribute);
  }

  /**
   * Apply validation function
   *
   * @param  {any|void} inputValue
   * @param  {any|void} ruleValue
   * @param  {string} attribute
   * @param  {function} callback
   * @return {boolean|undefined}
   */
  _apply(inputValue, ruleValue, attribute, callback = null) {
    const fn = this.isMissed() ? missedRuleValidator(this.name) : this.fn;
    return fn.apply(this, [inputValue, ruleValue, attribute, callback]);
  }

  /**
   * Set validating data
   *
   * @param {string} attribute
   * @param {any|void} inputValue
   * @param {any|void} ruleValue
   * @return {void}
   */
  _setValidatingData(attribute, inputValue, ruleValue) {
    this.attribute = attribute;
    this.inputValue = inputValue;
    this.ruleValue = ruleValue;
  }

  /**
   * Get parameters
   *
   * @return {array}
   */
  getParameters() {
    let value = [];
    if (isString(this.ruleValue)) {
      value = this.ruleValue.split(',');
    }
    if (isNumber(this.ruleValue)) {
      value.push(this.ruleValue);
    }
    if (Array.isArray(this.ruleValue)) {
      value = this.ruleValue;
    }
    return value;
  }

  /**
   * Get true size of value
   *
   * @return {any|integer|float|mixed|number}
   */
  getSize() {
    const value = this.inputValue;
    if (Array.isArray(value)) {
      return value.length;
    }
    if (isNumber(value)) {
      return value;
    }
    if (this.validator._hasNumericRule(this.attribute)) {
      return parseFloat(value, 10);
    }
    return value.length;
  }

  /**
   * Get the type of value being checked; numeric or string.
   *
   * @return {string}
   */
  _getValueType() {
    if (
      isNumber(this.inputValue) ||
      this.validator._hasNumericRule(this.attribute)
    ) {
      return 'numeric';
    }
    return 'string';
  }

  /**
   * Set the async callback response
   *
   * @param  {boolean|undefined} passes  Whether validation passed
   * @param  {string|undefined} message Custom error message
   * @return {void}
   */
  response(passes, message) {
    this.passes = passes === undefined || passes === true;
    this._customMessage = message;
    this.callback(this.passes, message);
  }

  /**
   * Set validator instance
   *
   * @param {Validator} validator
   * @return {void}
   */
  setValidator(validator) {
    this.validator = validator;
  }

  /**
   * Check if rule is missed
   *
   * @return {boolean}
   */
  isMissed() {
    return !isFunction(this.fn);
  }

  get customMessage() {
    return this.isMissed() ? missedRuleMessage : this._customMessage;
  }
}

export const manager = {
  /**
   * List of async rule names
   *
   * @type {Array}
   */
  asyncRules: [],

  /**
   * Implicit rules (rules to always validate)
   *
   * @type {Array}
   */
  implicitRules: [
    'required',
    'required_if',
    'required_unless',
    'required_with',
    'required_with_all',
    'required_without',
    'required_without_all',
    'accepted',
    'present'
  ],

  /**
   * Get rule by name
   *
   * @param  {string} name
   * @param validator
   * @return {Rules}
   */
  make(name, validator) {
    const async = this.isAsync(name);
    const rule = new Rules(name, rules[name], async);
    rule.setValidator(validator);
    return rule;
  },

  /**
   * Determine if given rule is async
   *
   * @param  {string}  name
   * @return {boolean}
   */
  isAsync(name) {
    let i = 0;
    const len = this.asyncRules.length;
    for (; i < len; i++) {
      if (this.asyncRules[i] === name) {
        return true;
      }
    }
    return false;
  },

  /**
   * Determine if rule is implicit (should always validate)
   *
   * @param {string} name
   * @return {boolean}
   */
  isImplicit(name) {
    return this.implicitRules.includes(name);
  },

  /**
   * Register new rule
   *
   * @param  {string}   name
   * @param  {function} fn
   * @return {void}
   */
  register(name, fn) {
    rules[name] = fn;
  },

  /**
   * Register new implicit rule
   *
   * @param  {string}   name
   * @param  {function} fn
   * @return {void}
   */
  registerImplicit(name, fn) {
    this.register(name, fn);
    this.implicitRules.push(name);
  },

  /**
   * Register async rule
   *
   * @param  {string}   name
   * @param  {function} fn
   * @return {void}
   */
  registerAsync(name, fn) {
    this.register(name, fn);
    this.asyncRules.push(name);
  },

  /**
   * Register implicit async rule
   *
   * @param  {string}   name
   * @param  {function} fn
   * @return {void}
   */
  registerAsyncImplicit(name, fn) {
    this.registerImplicit(name, fn);
    this.asyncRules.push(name);
  },

  registerMissedRuleValidator(fn, message) {
    missedRuleValidator = fn;
    missedRuleMessage = message;
  }
};

export default manager;
