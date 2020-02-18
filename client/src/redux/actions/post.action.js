import axios from 'axios';
import { POSTS_PATH, POSTS_LIKE_PATH, POSTS_UNLIKE_PATH, POSTS_COMMENT_PATH } from './api-paths';

import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  POST_LOADING,
  DELETE_POST,
  GET_POST,
  CLEAR_ERRORS
} from './types';

// Add Post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post(POSTS_PATH, postData)
    .then(res => {
      dispatch({ type: ADD_POST, payload: res.data })
    })
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }))
}

// Get Posts
export const getPosts = () => dispatch => {
  setPostLoading();
  axios
    .get(POSTS_PATH)
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      }))
    .catch(err => dispatch({ type: GET_POSTS, payload: null }))
}

// Get Post
export const getPost = id => dispatch => {
  setPostLoading();
  axios
    .get(POSTS_PATH.concat(`/${id}`))
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      }))
    .catch(err => dispatch({ type: GET_POST, payload: null }))
}

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(POSTS_PATH.concat(`/${id}`))
    .then(res => {
      dispatch({ type: DELETE_POST, payload: id })
    })
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }))
}

// Add Like
export const addLike = id => dispatch => {
  axios
    .post(POSTS_LIKE_PATH.concat(`/${id}`))
    .then(res => dispatch(getPosts()))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }))
}

// Remove Like
export const removeLike = id => dispatch => {
  axios
    .post(POSTS_UNLIKE_PATH.concat(`/${id}`))
    .then(res => dispatch(getPosts()))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }))
}

// Add Comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(POSTS_COMMENT_PATH.concat(`/${postId}`), commentData)
    .then(res => {
      dispatch({ type: GET_POST, payload: res.data })
    })
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }))
}

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(POSTS_COMMENT_PATH.concat(`/${postId}/${commentId}`))
    .then(res => {
      dispatch({ type: GET_POST, payload: res.data })
    })
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }))
}

// Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}