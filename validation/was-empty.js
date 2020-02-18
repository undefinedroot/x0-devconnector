// just check if the variable is empty regardless if object or string
const wasEmpty = value =>
  (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );

module.exports = wasEmpty;