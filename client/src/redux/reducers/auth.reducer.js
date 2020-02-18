import { SET_CURRENT_USER } from '../actions/types.js';
import wasEmpty from '../../validation/was-empty';

const INITIAL_STATE = {
  isAuthenticated: false,
  user: {}
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !wasEmpty(action.payload),
        user: action.payload
      }
    default:
      return state;
  }
}