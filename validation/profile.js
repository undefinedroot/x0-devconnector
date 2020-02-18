const Validator = require('validator');
const wasEmpty = require('./was-empty');

const validateProfileInput = ({ handle, status, skills, website, youtube, twitter, facebook, linkedin, instagram }) => {
  let errors = {};

  handle = !wasEmpty(handle) ? handle : '';
  status = !wasEmpty(status) ? status : '';
  skills = !wasEmpty(skills) ? skills : '';

  if (Validator.isEmpty(handle)) {
    errors.handle = 'Profile handle is required';
  } else if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }

  if (Validator.isEmpty(status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = 'Skills field is required';
  }

  if (!wasEmpty(website)) {
    if (!Validator.isURL(website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if (!wasEmpty(youtube)) {
    if (!Validator.isURL(youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (!wasEmpty(twitter)) {
    if (!Validator.isURL(twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if (!wasEmpty(facebook)) {
    if (!Validator.isURL(facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (!wasEmpty(linkedin)) {
    if (!Validator.isURL(linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  if (!wasEmpty(instagram)) {
    if (!Validator.isURL(instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: wasEmpty(errors)
  }
};

module.exports = validateProfileInput;