const Validator = require('validator');
const wasEmpty = require('./was-empty');

const validateRegisterInput = ({ name, email, password, password2 }) => {
  let errors = {};

  // making sure that the field has a value,
  // also do not allow spaces on the sides
  name = !wasEmpty(name) ? name.trim() : '';
  email = !wasEmpty(email) ? email.trim() : '';
  password = !wasEmpty(password) ? password.trim() : '';
  password2 = !wasEmpty(password2) ? password2.trim() : '';

  if (Validator.isEmpty(name)) {
    errors.name = 'Name field is required';
  } else if (!Validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters'
  }

  if (Validator.isEmpty(password2)) {
    errors.password2 = 'Confirm Password field is required';
  } else if (!Validator.equals(password, password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: wasEmpty(errors)
  }
};

module.exports = validateRegisterInput;