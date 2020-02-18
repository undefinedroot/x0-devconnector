const Validator = require('validator');
const wasEmpty = require('./was-empty');

const validateEducationInput = ({ school, degree, fieldOfStudy, from }) => {
  let errors = {};

  school = !wasEmpty(school) ? school : '';
  degree = !wasEmpty(degree) ? degree : '';
  fieldOfStudy = !wasEmpty(fieldOfStudy) ? fieldOfStudy : '';
  from = !wasEmpty(from) ? from : '';

  if (Validator.isEmpty(school)) {
    errors.school = 'School field is required';
  }

  if (Validator.isEmpty(degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(fieldOfStudy)) {
    errors.fieldOfStudy = 'Field Of Study field is required';
  }

  if (Validator.isEmpty(from)) {
    errors.from = 'From field is required';
  }

  return {
    errors,
    isValid: wasEmpty(errors)
  }
};

module.exports = validateEducationInput;