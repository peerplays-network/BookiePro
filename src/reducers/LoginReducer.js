import { ActionTypes } from '../constants';
import { LoadingStatus } from '../constants';

let initialState = {
<<<<<<< 860a029c0e5f50431908537dabf2389521b436b2
  loadingStatus: LoadingStatus.DEFAULT,
=======
  status: LoadingStatus.DEFAULT,
>>>>>>> combine login status and register status
  error: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.LOGIN_SET_LOADING_STATUS: {
      const loadingStatus = action.loadingStatus;
      return Object.assign({}, state, { loadingStatus });
    }
    case ActionTypes.LOGIN_SET_ERROR: {
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
