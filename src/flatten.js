import { isNaN } from 'lodash';

const flatten = (obj) => {
  const flattened = {};
  function recurse(current, property) {
    if (!property && Object.getOwnPropertyNames(current).length === 0) {
      return;
    }
    if (Object(current) !== current || Array.isArray(current)) {
      flattened[property] = current;
    } else {
      let isEmpty = true;
      for (const p in current) {
        isEmpty = false;
        recurse(current[p], property ? property + '.' + p : p);
      }
      if (isEmpty) {
        flattened[property] = {};
      }
    }
  }
  if (obj) {
    recurse(obj);
  }
  return flattened;
};

export const unflatten = (data = {}) => {
  const result = {};
  for (const i in data) {
    const keys = i.split('.');
    keys.reduce(function(r, e, j) {
      return (
        r[e] ||
        (r[e] = isNaN(Number(keys[j + 1]))
          ? keys.length - 1 === j
            ? data[i]
            : {}
          : [])
      );
    }, result);
  }
  return result;
};

export default flatten;
