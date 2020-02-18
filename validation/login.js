const Validator = require('validator');
const wasEmpty = require('./was-empty');

const validateLoginInput = ({ name, email, password, password2 }) => {
  let errors = {};

  // making sure that the field has a value,
  // also do not allow spaces on the sides
  email = !wasEmpty(email) ? email.trim() : '';
  password = !wasEmpty(password) ? password.trim() : '';

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: wasEmpty(errors)
  }
};

module.exports = validateLoginInput;