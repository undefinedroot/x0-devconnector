import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost } from '../../redux/actions/post.action';

class PostForm extends Component {
  state = {
    text: '',
    errors: {}
  };
  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props.auth;
    this.props.addPost({
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    });
    this.setState({ text: '' });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Something...</div>
          <div className="card-body">
            <form onSubmit={e => this.onSubmit(e)}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={e => this.onChange(e)}
                  error={errors.text}
                ></TextAreaFieldGroup>
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({ auth, errors });

export default connect(mapStateToProps, { addPost })(PostForm);
