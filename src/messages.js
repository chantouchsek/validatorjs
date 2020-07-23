import { isObject, isString } from 'lodash';
import Attributes from './attributes';
import flatten from './flatten';

class Messages {
  constructor(lang, messages = []) {
    this.lang = lang;
    this.messages = messages;
    this.customMessages = {};
    this.attributeNames = {};
  }

  /**
   * Set custom messages
   *
   * @param {object} customMessages
   * @return {void}
   */
  _setCustom(customMessages) {
    this.customMessages = customMessages || {};
  }

  /**
   * Set custom attribute names.
   *
   * @param {object} attributes
   */
  _setAttributeNames(attributes) {
    this.attributeNames = attributes;
  }

  /**
   * Set the attribute formatter.
   *
   * @param {function} func
   * @return {void}
   */
  _setAttributeFormatter(func) {
    this.attributeFormatter = func;
  }

  /**
   * Get attribute name to display.
   *
   * @param  {string} attribute
   * @return {string}
   */
  _getAttributeName(attribute) {
    let name = attribute;
    const attributes = flatten(this.messages.attributes);
    const attributeNames = flatten(this.attributeNames);
    if (attributeNames.hasOwnProperty(attribute)) {
      return attributeNames[attribute];
    } else if (attributes.hasOwnProperty(attribute)) {
      name = attributes[attribute];
    }
    if (this.attributeFormatter) {
      name = this.attributeFormatter(name);
    }
    return name;
  }

  /**
   * Get all messages
   *
   * @return {object}
   */
  all() {
    return this.messages;
  }

  /**
   * Render message
   *
   * @param  {Rules} rule
   * @return {string|[]}
   */
  render(rule) {
    if (rule.customMessage) {
      return rule.customMessage;
    }
    const template = this._getTemplate(rule);
    let message;
    if (Attributes.replacements[rule.name]) {
      message = Attributes.replacements[rule.name].apply(this, [template, rule]);
    } else {
      message = this._replacePlaceholders(rule, template, {});
    }
    return message;
  }

  /**
   * Get the template to use for given rule
   *
   * @param  {Rules} rule
   * @return {string}
   */
  _getTemplate(rule) {
    const messages = this.messages;
    let template = messages.def;
    const customMessages = this.customMessages;
    const formats = [rule.name + '.' + rule.attribute, rule.name];
    let i = 0;
    let format;
    for (; i < formats.length; i++) {
      format = formats[i];
      if (customMessages.hasOwnProperty(format)) {
        template = customMessages[format];
        break;
      } else if (messages.hasOwnProperty(format)) {
        template = messages[format];
        break;
      }
    }
    if (isObject(template)) {
      template = template[rule._getValueType()];
    }
    return template;
  }

  /**
   * Replace placeholders in the template using the data object
   *
   * @param  {Rules} rule
   * @param  {string} template
   * @param  {object} data
   * @return {string}
   */
  _replacePlaceholders(rule, template, data) {
    let message;
    let attribute;
    data.attribute = this._getAttributeName(rule.attribute);
    data[rule.name] = data[rule.name] || rule.getParameters().join(',');
    if (isString(template) && isObject(data)) {
      message = template;
      for (attribute in data) {
        message = message.replace(
          new RegExp(':' + attribute, 'g'),
          data[attribute]
        );
      }
    }
    return message;
  }
}

export default Messages;
