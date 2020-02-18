import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addComment } from '../../redux/actions/post.action';

class CommentForm extends Component {
  state = {
    text: '',
    errors: {}
  };
  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props.auth;
    const { postId } = this.props;
    this.props.addComment(postId, {
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
          <div className="card-header bg-info text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={e => this.onSubmit(e)}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Reply to post"
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

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({ auth, errors });

export default connect(mapStateToProps, { addComment })(CommentForm);
