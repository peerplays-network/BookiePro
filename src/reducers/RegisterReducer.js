import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';

let initialState = {
  loadingStatus: LoadingStatus.DEFAULT,
  error: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.REGISTER_SET_LOADING_STATUS: {
      const loadingStatus = action.loadingStatus;
      return Object.assign({}, state, { loadingStatus });
    }
    case ActionTypes.REGISTER_SET_ERROR: {
      const error = action.error;
      return Object.assign({}, state, {
        error,
        status: LoadingStatus.DEFAULT
      });
    }
    default:
      return state;
  }
}
