export const replacements = {
  /**
   * Between replacement (replaces :min and :max)
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  between(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      min: parameters[0],
      max: parameters[1]
    });
  },

  /**
   * Digits-Between replacement (replaces :min and :max)
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  digits_between(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      min: parameters[0],
      max: parameters[1]
    });
  },

  /**
   * Greater than replacement
   * @param {string} template
   * @param {Rules} rule
   * @return {string}
   */
  gt(template, rule) {
    const parameters = rule.getParameters();

    return this._replacePlaceholders(rule, template, {
      value: this._getAttributeName(parameters[0]),
    });
  },

  /**
   * Greater than or equal replacement
   * @param {string} template
   * @param {Rules} rule
   * @return {string}
   */
  gte(template, rule) {
    const parameters = rule.getParameters();

    return this._replacePlaceholders(rule, template, {
      value: this._getAttributeName(parameters[0]),
    });
  },

  /**
   * Less than replacement
   * @param {string} template
   * @param {Rules} rule
   * @return {string}
   */
  lt(template, rule) {
    const parameters = rule.getParameters();

    return this._replacePlaceholders(rule, template, {
      value: this._getAttributeName(parameters[0]),
    });
  },

  /**
   * Less than or equal replacement
   * @param {string} template
   * @param {Rules} rule
   * @return {string}
   */
  lte(template, rule) {
    const parameters = rule.getParameters();

    return this._replacePlaceholders(rule, template, {
      value: this._getAttributeName(parameters[0]),
    });
  },

  /**
   * Required_if replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  required_if(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      other: this._getAttributeName(parameters[0]),
      value: parameters[1]
    });
  },

  /**
   * Required_unless replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  required_unless(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      other: this._getAttributeName(parameters[0]),
      value: parameters[1]
    });
  },

  /**
   * Required_with replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  required_with(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      field: this._getAttributeName(parameters[0])
    });
  },

  /**
   * Required_with_all replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  required_with_all(template, rule) {
    const parameters = rule.getParameters();
    const getAttributeName = this._getAttributeName.bind(this);
    return this._replacePlaceholders(rule, template, {
      fields: parameters.map(getAttributeName).join(', ')
    });
  },

  /**
   * Required_without replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  required_without(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      field: this._getAttributeName(parameters[0])
    });
  },

  /**
   * Required_without_all replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  required_without_all(template, rule) {
    const parameters = rule.getParameters();
    const getAttributeName = this._getAttributeName.bind(this);
    return this._replacePlaceholders(rule, template, {
      fields: parameters.map(getAttributeName).join(', ')
    });
  },

  /**
   * After replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  after(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      after: this._getAttributeName(parameters[0])
    });
  },

  /**
   * Before replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  before(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      before: this._getAttributeName(parameters[0])
    });
  },

  /**
   * After_or_equal replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  after_or_equal(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      after_or_equal: this._getAttributeName(parameters[0])
    });
  },

  /**
   * Before_or_equal replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  before_or_equal(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      before_or_equal: this._getAttributeName(parameters[0])
    });
  },

  /**
   * Same replacement.
   *
   * @param  {string} template
   * @param  {Rules} rule
   * @return {string}
   */
  same(template, rule) {
    const parameters = rule.getParameters();
    return this._replacePlaceholders(rule, template, {
      same: this._getAttributeName(parameters[0])
    });
  }
};

export const formatter = (attribute) => {
  return attribute.replace(/[_\[]/g, ' ').replace(/]/g, '');
};

export default { replacements, formatter };
