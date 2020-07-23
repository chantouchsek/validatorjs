import { isUndefined } from 'lodash';
import Messages from './messages';

export const Lang = {
  messages: {},
  /**
   * Set messages for language
   *
   * @param {string} lang
   * @param {object} rawMessages
   * @return {void}
   */
  _set(lang, rawMessages) {
    this.messages[lang] = rawMessages;
  },

  /**
   * Set message for given language's rule.
   *
   * @param {string} lang
   * @param {string} attribute
   * @param {string|object} message
   * @return {void}
   */
  _setRuleMessage(lang, attribute, message) {
    this._load(lang);
    if (isUndefined(message)) {
      message = this.messages[lang].def;
    }

    this.messages[lang][attribute] = message;
  },

  /**
   * Load messages (if not already loaded)
   *
   * @param  {string} lang
   * @return {void}
   */
  _load(lang) {
    if (!this.messages[lang]) {
      try {
        const rawMessages = require(`./lang/${lang}`);
        this._set(lang, rawMessages);
      } catch (e) {
        const rawMessages = require('./lang/en');
        this._set(lang, rawMessages);
        // eslint-disable-next-line no-console
        console.warn(e);
      }
    }
  },

  /**
   * Get raw messages for language
   *
   * @param  {string} lang
   * @return {object}
   */
  _get(lang) {
    this._load(lang);
    return this.messages[lang];
  },

  /**
   * Make messages for given language
   *
   * @param  {string} lang
   * @return {Messages}
   */
  _make(lang) {
    this._load(lang);
    return new Messages(lang, this.messages[lang]);
  }
};

export default Lang;
