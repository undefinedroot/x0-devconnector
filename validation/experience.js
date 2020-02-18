const Validator = require('validator');
const wasEmpty = require('./was-empty');

const validateExperienceInput = ({ title, company, from }) => {
  let errors = {};

  title = !wasEmpty(title) ? title : '';
  company = !wasEmpty(company) ? company : '';
  from = !wasEmpty(from) ? from : '';

  if (Validator.isEmpty(title)) {
    errors.title = 'Job title field is required';
  }

  if (Validator.isEmpty(company)) {
    errors.company = 'Company field is required';
  }

  if (Validator.isEmpty(from)) {
    errors.from = 'From field is required';
  }

  return {
    errors,
    isValid: wasEmpty(errors)
  }
};

module.exports = validateExperienceInput;