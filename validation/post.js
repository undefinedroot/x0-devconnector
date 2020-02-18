const Validator = require('validator');
const wasEmpty = require('./was-empty');

const validatePostInput = (text) => {
  let errors = {};

  text = !wasEmpty(text) ? text.trim() : '';

  if (Validator.isEmpty(text)) {
    errors.text = 'Text field is required';
  } else if (!Validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 to 300 characters';
  }

  return {
    errors,
    isValid: wasEmpty(errors)
  }
};

module.exports = validatePostInput;