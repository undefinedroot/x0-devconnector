import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {}
    default:
      return state;
  }
}