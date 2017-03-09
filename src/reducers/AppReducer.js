import { ActionTypes } from '../constants';

const initialState = {
  account: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.APP_SET_ACCOUNT: {
      const account = action.account;
      return Object.assign({}, state, { account });
    }
    default:
      return state;
  }
}
