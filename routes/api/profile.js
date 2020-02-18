const express = require('express');
const router = express.Router();
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  // let's find the user's profile
  // also populate data from user
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(error => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('users', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles'
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profile: 'There are no profiles' });
    });
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by 'handle'
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by 'user_id'
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @route   POST api/profile
// @desc    Create or Edit user's profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), ({ body: formData, user }, res) => {

  const { handle, company, website, location, bio, status, githubUsername,
    skills, youtube, twitter, facebook, linkedin, instagram } = formData;

  const { errors, isValid } = validateProfileInput(formData);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get fields
  const profileFields = {};
  profileFields.user = user.id;  // 'user' contains: id, name, avatar, email

  if (handle) profileFields.handle = handle;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubUsername) profileFields.githubUsername = githubUsername;
  // skills - split into array
  if (typeof skills !== 'undefined') {
    profileFields.skills = skills.split(',').map(value => value.trim());
  }
  // social, initiate first
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  Profile.findOne({ user: user.id })
    .then(profile => {
      if (profile) {
        // update
        Profile.findOneAndUpdate(
          { user: user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // create
        // is handle existing?
        Profile
          .findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              return res.status(400).json(errors);
            }
            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile));
          });
      }
    })
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), ({ body: formData, user }, res) => {
  const { errors, isValid } = validateExperienceInput(formData);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: user.id })
    .then(profile => {
      const newExp = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        from: formData.from,
        to: formData.to,
        current: formData.current,
        description: formData.description
      };
      // Add to exp array
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), ({ body: formData, user }, res) => {
  const { errors, isValid } = validateEducationInput(formData);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: user.id })
    .then(profile => {
      const newEdu = {
        school: formData.school,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        from: formData.from,
        to: formData.to,
        current: formData.current,
        description: formData.description
      };
      // Add to edu array
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
});

// @route   POST api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item._id)
        .indexOf(req.params.exp_id);

      // splice out of array
      profile.experience.splice(removeIndex, 1);

      // save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {

      // Get remove index
      const removeIndex = profile.education
        .map(item => item._id)
        .indexOf(req.params.edu_id);

      // splice out of array, .splice wins over .filter
      profile.education.splice(removeIndex, 1);

      // save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOneAndRemove({
      user: req.user.id
    })
    .then(() => {
      User
        .findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }));
    });
});

module.exports = router;