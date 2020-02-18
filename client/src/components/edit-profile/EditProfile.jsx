import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import {
  createProfile,
  getCurrentProfile
} from '../../redux/actions/profile.action';
import wasEmpty from '../../validation/was-empty';

class CreateProfile extends Component {
  state = {
    displaySocialInputs: false,
    handle: '',
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubUsername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: '',
    errors: {}
  };
  onSubmit(e) {
    e.preventDefault();
    this.props.createProfile({ ...this.state }, this.props.history);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;
      // Bring skills array back to CSV
      const skillsCSV = profile.skills.join(',');
      // If profile field doesn't exist, make empty string
      profile.company = !wasEmpty(profile.company) ? profile.company : '';
      profile.website = !wasEmpty(profile.website) ? profile.website : '';
      profile.location = !wasEmpty(profile.location) ? profile.location : '';
      profile.githubUsername = !wasEmpty(profile.githubUsername)
        ? profile.githubUsername
        : '';
      profile.bio = !wasEmpty(profile.bio) ? profile.bio : '';
      profile.social = !wasEmpty(profile.social) ? profile.social : {};
      profile.twitter = !wasEmpty(profile.social.twitter)
        ? profile.social.twitter
        : '';
      profile.facebook = !wasEmpty(profile.social.facebook)
        ? profile.social.facebook
        : '';
      profile.linkedin = !wasEmpty(profile.social.linkedin)
        ? profile.social.linkedin
        : '';
      profile.youtube = !wasEmpty(profile.social.youtube)
        ? profile.social.youtube
        : '';
      profile.instagram = !wasEmpty(profile.social.instagram)
        ? profile.social.instagram
        : '';

      // Set component fields state
      this.setState({ ...profile, skills: skillsCSV });
    }
  }
  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={e => {
              this.onChange(e);
            }}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Facebook Profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={e => {
              this.onChange(e);
            }}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Linkedin Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={e => {
              this.onChange(e);
            }}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="YouTube Profile URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={e => {
              this.onChange(e);
            }}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Instagram Profile URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={e => {
              this.onChange(e);
            }}
            error={errors.instagram}
          />
        </div>
      );
    }

    // Select options for status
    const options = [
      { label: '* Select Professional Status', value: '0' },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student or Learning', value: 'Student or Learning' },
      { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit Profile</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={e => this.onSubmit(e)}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={e => this.onChange(e)}
                  error={errors.handle}
                  info="A unique handle for your profile URL. Your full name, company name,
                  nickname, etc."
                />
                <SelectListGroup
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={e => this.onChange(e)}
                  error={errors.status}
                  options={options}
                  info="Give us an idea of where you are at in your career."
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={e => this.onChange(e)}
                  error={errors.company}
                  info="Could be your own company or one you work for."
                />
                <TextFieldGroup
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={e => this.onChange(e)}
                  error={errors.website}
                  info="Could be your own website or a company one."
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={e => this.onChange(e)}
                  error={errors.location}
                  info="City or city & state suggested (eg. Boston, MA)."
                />
                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={e => this.onChange(e)}
                  error={errors.skills}
                  info="Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)."
                />
                <TextFieldGroup
                  placeholder="Github Username"
                  name="githubUsername"
                  value={this.state.githubUsername}
                  onChange={e => this.onChange(e)}
                  error={errors.githubUsername}
                  info="If you want your latest repos and a Github link, include your username."
                />
                <TextAreaFieldGroup
                  placeholder="Short Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={e => this.onChange(e)}
                  error={errors.bio}
                  info="Tell us a little about yourself."
                />
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={e => {
                      e.preventDefault();
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func,
  getCurrentProfile: PropTypes.func,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ profile, errors }) => ({ profile, errors });

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(CreateProfile)
);
