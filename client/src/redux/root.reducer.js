import { combineReducers } from 'redux';
import authReducer from './reducers/auth.reducer';
import errorReducer from './reducers/error.reducer';
import profileReducer from './reducers/profile.reducer';
import postReducer from './reducers/post.reducer';

export default combineReducers(
  {
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer,
    post: postReducer
  }
);