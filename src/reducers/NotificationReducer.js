import { ActionTypes } from '../constants';
import _ from 'lodash';

let initialState = {
  notifications: [],
  latestTransactionHistoryId: null
};

export default function (state = initialState, action) {
  switch(action.type) {
    case ActionTypes.NOTIFICATION_ADD_NOTIFICATIONS: {
      return Object.assign({}, state, {
        notifications: _.concat(action.notifications, state.notifications)
      });
    }
    case ActionTypes.NOTIFICATION_REMOVE_NOTIFICATIONS: {
      return Object.assign({}, state, {
        notifications: _.differenceWith(state.notifications, action.notifications, _.isEqual)
      });
    }
    case ActionTypes.NOTIFICATION_SET_LATEST_TRANSACTION_HISTORY_ID: {
      return Object.assign({}, state, {
        latestTransactionHistoryId: action.latestTransactionHistoryId
      });
    }
    default:
      return state;
  }
}
