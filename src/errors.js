import { is, isArray } from './utils';

class Errors {
  constructor(errors = {}) {
    this.errors = errors;
  }

  /**
   * Add new error message for given attribute
   *
   * @param  {string} attribute
   * @param  {string} message
   * @return {void}
   */
  add(attribute, message) {
    if (!this.has(attribute)) {
      this.errors[attribute] = [];
    }
    if (!this.errors[attribute].includes(message)) {
      this.errors[attribute].push(message);
    }
  }

  /**
   * Returns an array of error messages for an attribute, or an empty array
   *
   * @param  {string} attribute A key in the data object being validated
   * @return {array} An array of error messages
   */
  get(attribute) {
    if (this.has(attribute)) {
      return this.errors[attribute];
    }
    return [];
  }

  /**
   * Returns the first error message for an attribute, false otherwise
   *
   * @param  {string} attribute A key in the data object being validated
   * @return {string|boolean} First error message or false
   */
  first(attribute) {
    if (isArray(attribute)) {
      for (let i = 0; i < attribute.length; i++) {
        if (!this.errors.hasOwnProperty(attribute[i])) {
          continue;
        }
        return this.first(attribute[i]);
      }
    }
    return this.get(attribute)[0];
  }

  /**
   * Get all error messages from all failing attributes
   *
   * @return {Object} Failed attribute names for keys and an array of messages for values
   */
  all() {
    return this.errors;
  }

  /**
   * Determine if we have any errors.
   */
  any() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Determine if there are any error messages for an attribute
   *
   * @param  {string}  attribute A key in the data object being validated
   * @return {boolean}
   */
  has(attribute) {
    if (isArray(attribute)) {
      return is(Object.keys(this.errors), attribute);
    }
    let hasError = this.errors.hasOwnProperty(attribute);
    if (!hasError) {
      const errors = Object.keys(this.errors).filter(
        (e) => e.startsWith(`${attribute}.`) || e.startsWith(`${attribute}[`)
      );
      hasError = errors.length > 0;
    }
    return hasError;
  }

  /**
   * Fill the error object
   * @param errors
   */
  fill(errors = {}) {
    this.errors = errors;
  }

  /**
   * Flush error
   */
  flush() {
    this.errors = {};
  }

  /**
   * Clear one or all error fields.
   *
   * @param {String|undefined|Array} attribute
   */
  clear(attribute) {
    if (!attribute) return this.flush();
    const errors = Object.assign({}, this.errors);
    if (isArray(attribute)) {
      attribute.map((field) => {
        Object.keys(errors)
          .filter(
            (e) =>
              e === field ||
              e.startsWith(`${field}.`) ||
              e.startsWith(`${field}[`)
          )
          .forEach((e) => delete errors[e]);
      });
    } else {
      Object.keys(errors)
        .filter(
          (e) =>
            e === attribute ||
            e.startsWith(`${attribute}.`) ||
            e.startsWith(`${attribute}[`)
        )
        .forEach((e) => delete errors[e]);
    }
    this.fill(errors);
  }

  /**
   * Clear errors on keydown.
   *
   * @param {KeyboardEvent} event
   * @param {string} prefix
   */
  keydown(event, prefix = '') {
    const { name } = event.target;
    if (!name) return;
    let name2 = '';
    if (prefix) {
      name2 = `${prefix}.${name}`;
    }
    this.clear([name, name2]);
  }
}

export default Errors;
