'use strict';
import escapeStringRegexp from 'escape-string-regexp';

const reCache = new Map();

function makeRe(pattern, options) {
  const opts = Object.assign(
    {
      caseSensitive: false,
    },
    options
  );

  const cacheKey = pattern + JSON.stringify(opts);

  if (reCache.has(cacheKey)) {
    return reCache.get(cacheKey);
  }

  const negated = pattern[0] === '!';

  if (negated) {
    pattern = pattern.slice(1);
  }

  pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*');

  const re = new RegExp(`^${pattern}$`, opts.caseSensitive ? '' : 'i');
  re.negated = negated;
  reCache.set(cacheKey, re);

  return re;
}

export const isMatch = (input, pattern, options) => {
  const re = makeRe(pattern, options);
  const matches = re.test(input);
  return re.negated ? !matches : matches;
};

/**
 * Check if errors exist
 * @param {Array} errors
 * @param {Array|string} error
 * @returns {boolean}
 */
export function is(errors, error) {
  if (typeof error === 'string' && error.match(/[\*\!]/)) {
    return errors.filter(w => isMatch(w, error)).length > 0;
  }
  return Array.isArray(error) ? error.some(w => is(errors, w)) : errors.includes(error);
}

export function isArray(object) {
  return Object.prototype.toString.call(object) === '[object Array]';
}
