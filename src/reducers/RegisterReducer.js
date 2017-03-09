import { ActionTypes } from '../constants';
import { RegisterStatus } from '../constants';

let initialState = {
  status: RegisterStatus.DEFAULT,
  error: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.REGISTER_SET_STATUS: {
      const status = action.status;
      return Object.assign({}, state, { status });
    }
    case ActionTypes.REGISTER_SET_ERROR: {
      const error = action.error;
      return Object.assign({}, state, {
        error,
        status: RegisterStatus.DEFAULT
      });
    }
    default:
      return state;
  }
}
